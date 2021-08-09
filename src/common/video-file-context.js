import * as React from 'react'
import * as PropTypes from 'prop-types'

const VideoFileContext = React.createContext({
	videoFile: null,
	videoSrc: null,
	onVideoFile: () => {},
})

VideoFileProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function VideoFileProvider({children}) {
	const [videoSrc, setVideoSrc] = React.useState({})

	const onVideoFile = React.useCallback(videoFile => {
		setVideoSrc(({videoSrc}) => {
			if (videoSrc) URL.revokeObjectURL(videoSrc)
			return {videoFile, videoSrc: URL.createObjectURL(videoFile)}
		})
	}, [])

	return (
		<VideoFileContext.Provider
			value={{
				...videoSrc,
				onVideoFile,
			}}>
			{children}
		</VideoFileContext.Provider>
	)
}

export function useVideoFile() {
	return React.useContext(VideoFileContext)
}
