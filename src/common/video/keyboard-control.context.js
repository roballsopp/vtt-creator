import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import usePlay from './use-play.hook';
import usePlayProgress from './use-play-progress.hook';

const KeyboardControlContext = React.createContext({
	enableKeyboardControls: () => {},
	disableKeyboardControls: () => {},
});

KeyboardControlProvider.propTypes = {
	children: PropTypes.node,
};

export function KeyboardControlProvider({ children }) {
	const [disableRequests, setDisableRequests] = React.useState([]);

	const { onTogglePlay } = usePlay();
	const { handleNudge } = usePlayProgress();

	React.useEffect(() => {
		const handleKeyDown = e => {
			if (disableRequests.length) return;
			if (e.code === 'Space') {
				onTogglePlay();
			} else if (e.code === 'ArrowLeft') {
				handleNudge(-0.015);
			} else if (e.code === 'ArrowRight') {
				handleNudge(0.015);
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onTogglePlay, handleNudge, disableRequests]);

	const disableKeyboardControls = React.useCallback(() => {
		const requestId = uuid();
		setDisableRequests(r => [...r, requestId]);
		return requestId;
	}, []);

	const enableKeyboardControls = React.useCallback(requestId => {
		setDisableRequests(r => {
			const idx = r.indexOf(requestId);
			if (idx === -1) return r;
			const rCopy = [...r];
			rCopy.splice(idx, 1);
			return rCopy;
		});
	}, []);

	return (
		<KeyboardControlContext.Provider value={{ enableKeyboardControls, disableKeyboardControls }}>
			{children}
		</KeyboardControlContext.Provider>
	);
}

export function useKeyboardControl() {
	const { disableKeyboardControls, enableKeyboardControls } = React.useContext(KeyboardControlContext);

	const disableKeyboardRequest = React.useRef();

	const onFocus = React.useCallback(() => {
		disableKeyboardRequest.current = disableKeyboardControls();
	}, [disableKeyboardControls]);

	const onBlur = React.useCallback(() => {
		enableKeyboardControls(disableKeyboardRequest.current);
	}, [enableKeyboardControls]);

	return { onFocus, onBlur };
}
