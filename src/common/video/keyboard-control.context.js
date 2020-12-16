import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import usePlay from './use-play.hook';

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

	React.useEffect(() => {
		const handleKeyDown = e => {
			if (e.code === 'Space' && !disableRequests.length) {
				onTogglePlay();
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onTogglePlay, disableRequests]);

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
	return React.useContext(KeyboardControlContext);
}
