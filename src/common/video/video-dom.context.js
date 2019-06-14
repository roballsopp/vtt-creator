import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useToast } from '../toast-context';

const VideoDomContext = React.createContext({});

VideoDomProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function VideoDomProvider({ children }) {
	const toast = useToast();
	const [videoRef, onVideoRef] = React.useState();
	const [videoContainerRef, onVideoContainerRef] = React.useState();

	React.useEffect(() => {
		if (!videoRef) return;

		const onError = () => {
			toast.error('Something went wrong with the video.');
			console.error(videoRef.error);
		};

		videoRef.addEventListener('error', onError);

		return () => {
			videoRef.removeEventListener('error', onError);
		};
	}, [toast, videoRef]);

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
