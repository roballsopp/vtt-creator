import React from 'react'
import PropTypes from 'prop-types'
import {useVideoDom} from './video-dom.context'

const DurationContext = React.createContext({
	duration: 0,
})

DurationProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function DurationProvider({children}) {
	const {videoRef} = useVideoDom()
	const [duration, setDuration] = React.useState(0)

	React.useEffect(() => {
		if (!videoRef) return

		const onDurationChange = () => {
			setDuration(videoRef.duration)
		}

		videoRef.addEventListener('durationchange', onDurationChange)

		return () => {
			videoRef.removeEventListener('durationchange', onDurationChange)
		}
	}, [videoRef])

	return (
		<DurationContext.Provider value={React.useMemo(() => ({duration}), [duration])}>
			{children}
		</DurationContext.Provider>
	)
}

export function useDuration() {
	return React.useContext(DurationContext)
}
