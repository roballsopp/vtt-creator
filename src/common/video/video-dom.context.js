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
	const playPromiseRef = React.useRef(Promise.resolve());

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

	// play() method is actually asynchronous and you'll get fun error messages if you try to pause before play has resolved:
	// https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
	const togglePlay = React.useCallback(() => {
		if (!videoRef) return;
		return playPromiseRef.current.then(() => {
			if (videoRef.paused || videoRef.ended) return videoRef.play();
			else videoRef.pause();
		});
	}, [videoRef]);

	return (
		<VideoDomContext.Provider
			value={{
				videoRef,
				videoContainerRef,
				onVideoRef,
				onVideoContainerRef,
				togglePlay,
			}}>
			{children}
		</VideoDomContext.Provider>
	);
}

export function useVideoDom() {
	return React.useContext(VideoDomContext);
}
