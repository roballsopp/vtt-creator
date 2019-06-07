import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const VolumeContext = React.createContext({});

VolumeProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function VolumeProvider({ children }) {
	const [volume, setVolume] = React.useState(1);
	const [muted, setMuted] = React.useState(false);
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		const onLoadStart = () => {
			onVolumeChange(volume); // TODO: check that this works
		};
		const onVolumeChange = () => setVolume(videoRef.volume);

		if (videoRef) {
			videoRef.addEventListener('loadstart', onLoadStart);
			videoRef.addEventListener('volumechange', onVolumeChange);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('loadstart', onLoadStart);
				videoRef.removeEventListener('volumechange', onVolumeChange);
			}
		};
	}, [videoRef, volume]);

	const onVolumeChange = React.useCallback(
		volume => {
			if (videoRef) videoRef.volume = volume;
		},
		[videoRef]
	);

	const onToggleMute = React.useCallback(() => {
		if (videoRef) {
			videoRef.muted = !videoRef.muted;
			setMuted(videoRef.muted);
		}
	}, [videoRef]);

	return (
		<VolumeContext.Provider
			value={{
				volume,
				muted,
				onVolumeChange,
				onToggleMute,
			}}>
			{children}
		</VolumeContext.Provider>
	);
}

export function useVolume() {
	return React.useContext(VolumeContext);
}
