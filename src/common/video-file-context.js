import * as React from 'react';
import * as PropTypes from 'prop-types';

const VideoFileContext = React.createContext({
	onVideoFile: () => {},
});

VideoFileProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function VideoFileProvider({ children }) {
	const [videoFile, onVideoFile] = React.useState();

	return (
		<VideoFileContext.Provider
			value={{
				videoFile,
				onVideoFile,
			}}>
			{children}
		</VideoFileContext.Provider>
	);
}

export function useVideoFile() {
	return React.useContext(VideoFileContext);
}
