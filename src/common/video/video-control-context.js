import React from 'react'
import PropTypes from 'prop-types'
import {useVideoDom} from './video-dom.context'
import {useToast} from '../toast-context'
import {handleError} from '../../services/error-handler.service'

const VideoControlContext = React.createContext({
	togglePlay: () => {},
	seekVideo: () => {},
	nudgeVideo: () => {},
	setVolume: () => {},
	toggleMute: () => {},
	toggleCaptions: () => {},
})

VideoControlProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

// This provides access to tell the video element how to behave
//  For performance reasons, this context should only update when videoRef changes.
//  Don't put video state in here, like `seeking` or `paused`, since that will trigger
//  possibly unwanted state updates in users of this context
export function VideoControlProvider({children}) {
	const {videoRef} = useVideoDom()
	const playPromiseRef = React.useRef(Promise.resolve())
	const toast = useToast()

	return (
		<VideoControlContext.Provider
			value={React.useMemo(
				() => ({
					// play() method is actually asynchronous and you'll get fun error messages if you try to pause before play has resolved:
					// https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
					togglePlay: () => {
						if (!videoRef) return
						return playPromiseRef.current
							.then(() => {
								if (videoRef.paused || videoRef.ended) return videoRef.play()
								else videoRef.pause()
							})
							.catch(err => {
								handleError(err)
								toast.error('Your browser is unable to play the video file you selected.')
							})
					},
					seekVideo: newTime => {
						if (videoRef) {
							videoRef.currentTime = newTime
						}
					},
					nudgeVideo: delta => {
						if (videoRef) {
							videoRef.currentTime = Math.min(Math.max(videoRef.currentTime + delta, 0), videoRef.duration)
						}
					},
					setVolume: volume => {
						if (videoRef) videoRef.volume = volume
					},
					toggleMute: () => {
						if (videoRef) videoRef.muted = !videoRef.muted
					},
					toggleCaptions: () => {
						if (videoRef) {
							videoRef.textTracks[0].mode = videoRef.textTracks[0].mode === 'showing' ? 'hidden' : 'showing'
						}
					},
				}),
				[toast, videoRef]
			)}>
			{children}
		</VideoControlContext.Provider>
	)
}

export function useVideoControl() {
	return React.useContext(VideoControlContext)
}
