import React from 'react';
import PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const SeekingContext = React.createContext({
	seeking: false,
});

SeekingProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function SeekingProvider({ children }) {
	const [seeking, setSeeking] = React.useState(false);
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		if (!videoRef) return;

		const handleSeeking = () => {
			setSeeking(true);
		};

		const handleSeeked = () => {
			setSeeking(false);
		};

		videoRef.addEventListener('seeking', handleSeeking);
		videoRef.addEventListener('seeked', handleSeeked);

		return () => {
			videoRef.removeEventListener('seeking', handleSeeking);
			videoRef.addEventListener('seeked', handleSeeked);
		};
	}, [videoRef]);

	return (
		<SeekingContext.Provider
			value={React.useMemo(
				() => ({
					seeking,
				}),
				[seeking]
			)}>
			{children}
		</SeekingContext.Provider>
	);
}

export function useSeeking() {
	return React.useContext(SeekingContext);
}
