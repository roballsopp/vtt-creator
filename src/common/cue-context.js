import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { useToast } from './toast-context';
import { getCuesFromStorage, storeCues } from '../services/vtt.service';
import { handleError } from '../services/error-handler.service';
import { useVideoDom } from './video';

const CuesContext = React.createContext({
	cues: [],
	loading: true,
	onAddCue: () => {},
	onRemoveCue: () => {},
	changeCueStart: () => {},
	changeCueEnd: () => {},
	changeCueText: () => {},
	changeCueTiming: () => {},
	onChangeCues: () => {},
	onLoadingCues: () => {},
});

CuesProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function CuesProvider({ children }) {
	const [cues, setCues] = React.useState([]);
	const [loading, onLoadingCues] = React.useState(true);
	const toast = useToast();
	const { videoRef } = useVideoDom();

	const saveCuesToStorage = React.useCallback(cues => {
		try {
			storeCues(cues);
		} catch (e) {
			handleError(e);
		}
	}, []);

	// load cues on mount
	React.useEffect(() => {
		try {
			const loadedCues = getCuesFromStorage();
			if (loadedCues) setCues(loadedCues);
		} catch (e) {
			handleError(e);
			toast.error('There was a problem loading the cues from your last session.');
		}
		onLoadingCues(false);
	}, [toast]);

	// save cues if we leave the site
	React.useEffect(() => {
		const handleBeforeUnload = () => {
			saveCuesToStorage(cues);
		};
		// this actually fires when the browser window is closing _and_ when a react router navigation happens
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [cues, saveCuesToStorage]);

	const onAddCue = React.useCallback(() => {
		setCues(cues => {
			const newCues = cues.slice();

			if (videoRef) {
				// if we have a video loaded, insert the new cue at the current video time
				const newCue = new VTTCue(videoRef.currentTime, videoRef.currentTime + 2, '');
				const newIndex = newCues.findIndex(c => c.startTime > newCue.startTime);
				if (newIndex === -1) {
					newCues.push(newCue);
				} else {
					newCues.splice(newIndex, 0, newCue);
				}
			} else if (cues.length) {
				// if we have some cues already, but no video, insert after the last cue
				const lastCue = cues[cues.length - 1];
				newCues.push(new VTTCue(lastCue.endTime, lastCue.endTime + 2, ''));
			} else {
				// if we're here, this is the only cue, and we have no video. just put it at the end
				newCues.push(new VTTCue(0, 2, ''));
			}

			return newCues;
		});
	}, [videoRef]);

	const onRemoveCue = React.useCallback(i => {
		setCues(cues => {
			const newCues = cues.slice();
			newCues.splice(i, 1);
			return newCues;
		});
	}, []);

	const changeCueStart = React.useCallback((cueIdx, newStartTime) => {
		setCues(cues => {
			const newCues = cues.slice();
			const oldCue = cues[cueIdx];
			newCues[cueIdx] = new VTTCue(newStartTime, oldCue.endTime, oldCue.text, oldCue.id);
			return sortBy(newCues, ['startTime']);
		});
	}, []);

	const changeCueEnd = React.useCallback((cueIdx, newEndTime) => {
		setCues(cues => {
			const newCues = cues.slice();
			const oldCue = cues[cueIdx];
			newCues[cueIdx] = new VTTCue(oldCue.startTime, newEndTime, oldCue.text, oldCue.id);
			return newCues;
		});
	}, []);

	const changeCueText = React.useCallback((cueIdx, newText) => {
		setCues(cues => {
			const newCues = cues.slice();
			const oldCue = cues[cueIdx];
			newCues[cueIdx] = new VTTCue(oldCue.startTime, oldCue.endTime, newText, oldCue.id);
			return newCues;
		});
	}, []);

	const changeCueTiming = React.useCallback((cueIdx, { startDelta = 0, endDelta = 0 }) => {
		setCues(cues => {
			const oldCue = cues[cueIdx];

			let newStartTime = oldCue.startTime + startDelta;
			let newEndTime = oldCue.endTime + endDelta;

			if (newStartTime < 0 && endDelta) {
				newStartTime = 0;
				newEndTime = oldCue.endTime - oldCue.startTime;
			} else if (newStartTime < 0) {
				newStartTime = 0;
			}

			const newCues = cues.slice();
			newCues[cueIdx] = new VTTCue(newStartTime, newEndTime, oldCue.text, oldCue.id);

			return sortBy(newCues, ['startTime']);
		});
	}, []);

	return (
		<CuesContext.Provider
			value={React.useMemo(
				() => ({
					cues,
					loading,
					onAddCue,
					onRemoveCue,
					changeCueStart,
					changeCueEnd,
					changeCueText,
					changeCueTiming,
					onChangeCues: setCues,
					onLoadingCues,
				}),
				[cues, loading, onAddCue, onRemoveCue, changeCueStart, changeCueEnd, changeCueText, changeCueTiming]
			)}>
			{children}
		</CuesContext.Provider>
	);
}

export function useCues() {
	return React.useContext(CuesContext);
}
