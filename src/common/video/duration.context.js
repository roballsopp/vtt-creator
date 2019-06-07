import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const DurationContext = React.createContext({ duration: 0 });

DurationProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function DurationProvider({ children }) {
	const [duration, setDuration] = React.useState();
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		const onDurationChange = () => {
			setDuration(videoRef.duration);
		};

		if (videoRef) {
			videoRef.addEventListener('durationchange', onDurationChange);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('durationchange', onDurationChange);
			}
		};
	}, [videoRef, duration]);

	return <DurationContext.Provider value={{ duration }}>{children}</DurationContext.Provider>;
}

export function useDuration() {
	return React.useContext(DurationContext);
}
