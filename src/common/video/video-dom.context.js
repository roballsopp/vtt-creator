import * as React from 'react';
import * as PropTypes from 'prop-types';

const VideoDomContext = React.createContext({});

VideoDomProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function VideoDomProvider({ children }) {
	const [videoRef, onVideoRef] = React.useState();
	const [videoContainerRef, onVideoContainerRef] = React.useState();

	return (
		<VideoDomContext.Provider
			value={{
				videoRef,
				videoContainerRef,
				onVideoRef,
				onVideoContainerRef,
			}}>
			{children}
		</VideoDomContext.Provider>
	);
}

export function useVideoDom() {
	return React.useContext(VideoDomContext);
}
