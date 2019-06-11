import * as React from 'react';
import * as PropTypes from 'prop-types';
import sortBy from 'lodash.sortby';
import { CuePropType } from './prop-types';

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

export function CuesProvider(props) {
	const [cues, setCues] = React.useState([]);
	const [loading, onLoadingCues] = React.useState(false);

	const onChangeCues = React.useCallback((newCues, reorder) => {
		const orderedCues = reorder ? sortBy(newCues, ['startTime']) : newCues;
		setCues(orderedCues);
	}, []);

	const onChangeCue = React.useCallback(
		(cue, i, reorder) => {
			const newCues = cues.slice();
			newCues[i] = cue;
			onChangeCues(newCues, reorder);
		},
		[cues, onChangeCues]
	);

	const onAddCue = React.useCallback(() => {
		if (cues.length) {
			const lastCue = cues[cues.length - 1];
			return onChangeCues(cues.concat(new VTTCue(lastCue.endTime, lastCue.endTime + 2, '')));
		}
		return onChangeCues([new VTTCue(0, 2, '')]);
	}, [cues, onChangeCues]);

	const onRemoveCue = React.useCallback(
		i => {
			const newCues = cues.slice();
			newCues.splice(i, 1);
			return onChangeCues(newCues);
		},
		[cues, onChangeCues]
	);

	return (
		<CuesContext.Provider
			value={{
				cues,
				loading,
				onAddCue,
				onRemoveCue,
				// onChangeCue args (cue, i, reorder)
				onChangeCue,
				// onChangeCues args (cue, reorder)
				onChangeCues,
				onLoadingCues,
			}}>
			{props.children}
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
