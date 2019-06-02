import * as React from 'react';
import * as PropTypes from 'prop-types';

const OverlayContext = React.createContext({});

OverlayProvider.propTypes = {
	children: PropTypes.node,
};

export function OverlayProvider({ children }) {
	const [showOverlay, setShowOverlay] = React.useState(true);
	const [overlayTimeout, setOverlayTimeout] = React.useState();

	const onClearOverlayTimeout = React.useCallback(() => {
		if (overlayTimeout) {
			clearTimeout(overlayTimeout);
			setOverlayTimeout(null);
		}
	}, [overlayTimeout]);

	React.useEffect(() => onClearOverlayTimeout, [onClearOverlayTimeout]);

	const onStartOverlayTimeout = React.useCallback(() => {
		setShowOverlay(true);
		onClearOverlayTimeout();
		setOverlayTimeout(
			setTimeout(() => {
				setShowOverlay(false);
			}, 3000)
		);
	}, [onClearOverlayTimeout]);

	const onShowOverlay = React.useCallback(() => {
		onClearOverlayTimeout();
		setShowOverlay(true);
	}, [onClearOverlayTimeout]);

	return (
		<OverlayContext.Provider
			value={{
				showOverlay,
				onShowOverlay,
				onStartOverlayTimeout,
			}}>
			{children}
		</OverlayContext.Provider>
	);
}

export function useOverlay() {
	return React.useContext(OverlayContext);
}
