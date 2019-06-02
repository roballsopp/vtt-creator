import * as React from 'react';
import * as PropTypes from 'prop-types';

const OverlayContext = React.createContext({});

OverlayProvider.propTypes = {
	children: PropTypes.node,
};

export function OverlayProvider({ children }) {
	const [showOverlay, setShowOverlay] = React.useState(true);
	const [overlayTimeout, setOverlayTimeout] = React.useState();

	React.useEffect(() => () => clearTimeout(overlayTimeout), [overlayTimeout]);

	const onStartOverlayTimeout = React.useCallback(() => {
		setShowOverlay(true);
		if (overlayTimeout) {
			clearTimeout(overlayTimeout);
		}
		setOverlayTimeout(
			setTimeout(() => {
				setShowOverlay(false);
			}, 3000)
		);
	}, [overlayTimeout]);

	const onShowOverlay = React.useCallback(() => {
		if (overlayTimeout) {
			clearTimeout(overlayTimeout);
			setOverlayTimeout(null);
		}
		setShowOverlay(true);
	}, [overlayTimeout]);

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
