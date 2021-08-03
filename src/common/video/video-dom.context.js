import React from 'react'
import PropTypes from 'prop-types'
import {useToast} from '../toast-context'
import {handleError} from '../../services/error-handler.service'

const VideoDomContext = React.createContext({
	videoRef: null,
	videoContainerRef: null,
	onVideoRef: () => {},
	onVideoContainerRef: () => {},
})

VideoDomProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function VideoDomProvider({children}) {
	const toast = useToast()
	const [videoRef, onVideoRef] = React.useState()
	const [videoContainerRef, onVideoContainerRef] = React.useState()

	React.useEffect(() => {
		if (!videoRef) return

		const onError = () => {
			switch (videoRef.error?.code) {
				case 2:
					toast.error('Could not access the video file you selected.')
					break
				case 3:
				case 4:
					toast.error('Your browser is unable to play the video file you selected.')
					break
				default:
					toast.error('Unknown error loading video. Video type may not be supported.')
			}
			videoRef.error && handleError(new Error(`CODE ${videoRef.error.code} - ${videoRef.error.message}`))
		}

		videoRef.addEventListener('error', onError)

		return () => {
			videoRef.removeEventListener('error', onError)
		}
	}, [toast, videoRef])

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
	)
}

export function useVideoDom() {
	return React.useContext(VideoDomContext)
}
