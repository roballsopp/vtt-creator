import * as React from 'react';
import * as PropTypes from 'prop-types';
import sortBy from 'lodash.sortby';
import { CuePropType } from './prop-types';
import { useToast } from './toast-context';
import { getCuesFromStorage, storeCues } from '../services/vtt.service';
import { handleError } from '../services/error-handler.service';

const CuesContext = React.createContext({
	cues: [],
	onAddCue: () => {},
	onRemoveCue: () => {},
	// onChangeCue takes three args, the new cue, the index of the cue, and a boolean to indicate whether startTime was changed
	onChangeCue: () => {},
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

	const onChangeCues = React.useCallback((newCues, reorder) => {
		const orderedCues = reorder ? sortBy(newCues, ['startTime']) : newCues;
		setCues(orderedCues);
	}, []);

	const saveCuesToStorage = React.useCallback(() => {
		try {
			storeCues(cues);
		} catch (e) {
			handleError(e);
		}
	}, [cues]);

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
		window.addEventListener('beforeunload', saveCuesToStorage);
		return () => {
			window.removeEventListener('beforeunload', saveCuesToStorage);
		};
	}, [saveCuesToStorage]);

	// save cues on unmount
	React.useEffect(() => () => saveCuesToStorage(), [saveCuesToStorage]);

	return (
		<CuesContext.Provider
			value={React.useMemo(
				() => ({
					cues,
					loading,
					onAddCue: () => {
						if (cues.length) {
							const lastCue = cues[cues.length - 1];
							return onChangeCues(cues.concat(new VTTCue(lastCue.endTime, lastCue.endTime + 2, '')));
						}
						return onChangeCues([new VTTCue(0, 2, '')]);
					},
					onRemoveCue: i => {
						const newCues = cues.slice();
						newCues.splice(i, 1);
						return onChangeCues(newCues);
					},
					// onChangeCue args (cue, i, reorder)
					onChangeCue: (cue, i, reorder) => {
						const newCues = cues.slice();
						newCues[i] = cue;
						onChangeCues(newCues, reorder);
					},
					// onChangeCues args (cue, reorder)
					onChangeCues,
					onLoadingCues,
				}),
				[cues, loading, onChangeCues]
			)}>
			{children}
		</CuesContext.Provider>
	);
}

export function useCues() {
	return React.useContext(CuesContext);
}

/* Context for a SINGLE cue.

   Wrap up an individual cue's index in the list, and
   some of the logic associated with changing a cue
*/
const CueContext = React.createContext({
	cue: {},
	onChangeCueStart: () => {},
	onChangeCueEnd: () => {},
	onDeltaCue: () => {},
	onChangeCueText: () => {},
	onRemoveCue: () => {},
});

CueProvider.propTypes = {
	cue: CuePropType,
	cueIndex: PropTypes.number,
	children: PropTypes.node.isRequired,
};

export function CueProvider({ cue, cueIndex, children }) {
	const { onChangeCue, onRemoveCue } = useCues();

	return (
		<CueContext.Provider
			value={React.useMemo(
				() => ({
					cue,
					onChangeCueStart: newStartTime => {
						const newCue = new VTTCue(newStartTime, cue.endTime, cue.text);
						onChangeCue(newCue, cueIndex, true);
					},
					onChangeCueEnd: newEndTime => {
						const newCue = new VTTCue(cue.startTime, newEndTime, cue.text);
						onChangeCue(newCue, cueIndex);
					},
					onDeltaCue: ({ startDelta = 0, endDelta = 0 }) => {
						let newStartTime = cue.startTime + startDelta;
						let newEndTime = cue.endTime + endDelta;

						if (newStartTime < 0 && endDelta) {
							newStartTime = 0;
							newEndTime = cue.endTime - cue.startTime;
						} else if (newStartTime < 0) {
							newStartTime = 0;
						}

						const newCue = new VTTCue(newStartTime, newEndTime, cue.text);
						onChangeCue(newCue, cueIndex);
					},
					onChangeCueText: newText => {
						const newCue = new VTTCue(cue.startTime, cue.endTime, newText);
						onChangeCue(newCue, cueIndex);
					},
					onRemoveCue: () => onRemoveCue(cueIndex),
				}),
				[cue, cueIndex, onChangeCue, onRemoveCue]
			)}>
			{children}
		</CueContext.Provider>
	);
}

export function useCue() {
	return React.useContext(CueContext);
}
