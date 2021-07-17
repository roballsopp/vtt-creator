import React from 'react'
import PropTypes from 'prop-types'
import {useVideoDom} from './video-dom.context'

const VolumeContext = React.createContext({
	volume: 1,
	muted: false,
})

VolumeProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function VolumeProvider({children}) {
	const [volume, setVolume] = React.useState(1)
	const [muted, setMuted] = React.useState(false)
	const {videoRef} = useVideoDom()

	React.useEffect(() => {
		if (!videoRef) return

		setVolume(videoRef.volume)
		setMuted(videoRef.muted)

		// when a new video loads, set its volume and mute status to whatever the old video was set to
		const onLoadStart = () => {
			videoRef.volume = volume // TODO: check that this works
			videoRef.muted = muted
		}

		const onVolumeChange = () => {
			setVolume(videoRef.volume)
			setMuted(videoRef.muted)
		}

		videoRef.addEventListener('loadstart', onLoadStart)
		videoRef.addEventListener('volumechange', onVolumeChange)

		return () => {
			videoRef.removeEventListener('loadstart', onLoadStart)
			videoRef.removeEventListener('volumechange', onVolumeChange)
		}
	}, [muted, volume, videoRef])

	return (
		<VolumeContext.Provider
			value={React.useMemo(
				() => ({
					volume,
					muted,
				}),
				[volume, muted]
			)}>
			{children}
		</VolumeContext.Provider>
	)
}

export function useVolume() {
	return React.useContext(VolumeContext)
}
