import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { useVideoControl } from './video-control-context';

const KeyboardControlContext = React.createContext({
	enableKeyboardControls: () => {},
	disableKeyboardControls: () => {},
});

KeyboardControlProvider.propTypes = {
	children: PropTypes.node,
};

export function KeyboardControlProvider({ children }) {
	const [disableRequests, setDisableRequests] = React.useState([]);

	const { togglePlay, nudgeVideo } = useVideoControl();

	React.useEffect(() => {
		const handleKeyDown = e => {
			if (disableRequests.length) return;
			// e.code doesn't work in ie11
			if (e.keyCode === 32) {
				togglePlay();
			} else if (e.keyCode === 37) {
				nudgeVideo(-0.05); // this can apparently get too small for ie11 (0.015 wouldn't work)
			} else if (e.keyCode === 39) {
				nudgeVideo(0.05);
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [togglePlay, nudgeVideo, disableRequests]);

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
