import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const CaptionsContext = React.createContext({});

CaptionsProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function CaptionsProvider({ children }) {
	const [captions, setCaptions] = React.useState(true);
	const { videoRef } = useVideoDom();

	const onToggleCaptions = React.useCallback(() => {
		if (videoRef) {
			videoRef.textTracks[0].mode = videoRef.textTracks[0].mode === 'showing' ? 'hidden' : 'showing';
			setCaptions(videoRef.textTracks[0].mode === 'showing');
		}
	}, [videoRef]);

	return (
		<CaptionsContext.Provider
			value={{
				captions,
				onToggleCaptions,
			}}>
			{children}
		</CaptionsContext.Provider>
	);
}

export function useCaptions() {
	return React.useContext(CaptionsContext);
}
