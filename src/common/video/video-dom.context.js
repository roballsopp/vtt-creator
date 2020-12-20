import React from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../toast-context';

const VideoDomContext = React.createContext({
	videoRef: null,
	videoContainerRef: null,
	onVideoRef: () => {},
	onVideoContainerRef: () => {},
});

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
			value={React.useMemo(
				() => ({
					videoRef,
					videoContainerRef,
					onVideoRef,
					onVideoContainerRef,
				}),
				[videoRef, videoContainerRef, onVideoRef, onVideoContainerRef]
			)}>
			{children}
		</VideoDomContext.Provider>
	);
}

export function useVideoDom() {
	return React.useContext(VideoDomContext);
}
