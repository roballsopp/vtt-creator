import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useDuration } from '../common/video';
import { useCues } from '../common';

const PlayerDurationContext = React.createContext({});

PlayerDurationProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function PlayerDurationProvider({ children }) {
	const { duration: videoDuration } = useDuration();
	const cueDuration = useCueDuration();

	return (
		<PlayerDurationContext.Provider
			value={React.useMemo(
				() => ({
					duration: videoDuration || cueDuration,
				}),
				[videoDuration, cueDuration]
			)}>
			{children}
		</PlayerDurationContext.Provider>
	);
}

function useCueDuration() {
	const { cues } = useCues();
	if (cues && cues.length) {
		return cues[cues.length - 1].endTime;
	}
}

export function usePlayerDuration() {
	return React.useContext(PlayerDurationContext);
}
