import React from 'react';
import PropTypes from 'prop-types';
import { usePlayEvent } from './playing-context';
import { useVideoDom } from './video-dom.context';

const OverlayContext = React.createContext({});

OverlayProvider.propTypes = {
	children: PropTypes.node,
};

export function OverlayProvider({ children }) {
	const { videoContainerRef } = useVideoDom();
	const [showOverlay, setShowOverlay] = React.useState(true);
	const [suspendMouseMove, setSuspendMouseMove] = React.useState(false);
	const [playing, setPlaying] = React.useState(true);
	const overlayTimeout = React.useRef();

	const onStartOverlayTimeout = React.useCallback((timeout = 3000) => {
		setShowOverlay(true);
		if (overlayTimeout.current) {
			clearTimeout(overlayTimeout.current);
		}
		overlayTimeout.current = setTimeout(() => {
			setShowOverlay(false);
		}, timeout);
	}, []);

	usePlayEvent(
		React.useCallback(playing => {
			setPlaying(playing);
			if (!playing) {
				setShowOverlay(true);
				clearTimeout(overlayTimeout.current);
			} else {
				// if playing, hide overlay faster than normal because the user probably doesn't want to see it anymore
				setSuspendMouseMove(true);
				overlayTimeout.current = setTimeout(() => {
					setShowOverlay(false);
					setSuspendMouseMove(false);
				}, 500);
			}
		}, [])
	);

	React.useEffect(() => {
		if (!playing || suspendMouseMove) return;

		const startTimeout = () => onStartOverlayTimeout();
		if (videoContainerRef) {
			videoContainerRef.addEventListener('mousemove', startTimeout);
		}

		return () => {
			if (videoContainerRef) {
				videoContainerRef.removeEventListener('mousemove', startTimeout);
			}
		};
	}, [playing, onStartOverlayTimeout, videoContainerRef, suspendMouseMove]);

	// clean up any timeouts on unmount
	React.useEffect(() => () => clearTimeout(overlayTimeout.current), []);

	return (
		<OverlayContext.Provider
			value={React.useMemo(
				() => ({
					showOverlay: !playing || showOverlay,
					onShowOverlay: () => {
						if (overlayTimeout.current) {
							clearTimeout(overlayTimeout.current);
						}
						setShowOverlay(true);
					},
					onStartOverlayTimeout,
				}),
				[onStartOverlayTimeout, playing, showOverlay]
			)}>
			{children}
		</OverlayContext.Provider>
	);
}

export function useOverlay() {
	return React.useContext(OverlayContext);
}
