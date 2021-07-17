import React from 'react'
import PropTypes from 'prop-types'
import {usePlayTimeEvent} from '../common/video'
import {useAutoScroll} from './auto-scroll.context'

AutoScrollItem.propTypes = {
	cueTime: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
}

function AutoScrollItem({cueTime, children, className, ...props}) {
	const {scrollToChild} = useAutoScroll()

	const prevTimeRef = React.useRef(0)
	const itemContainerRef = React.useRef(null)

	usePlayTimeEvent(
		React.useCallback(
			currentTime => {
				const cueWasJustPassedForward = currentTime >= cueTime && prevTimeRef.current < cueTime
				const cueWasJustPassedBackward = currentTime < cueTime && prevTimeRef.current >= cueTime
				if (itemContainerRef.current && (cueWasJustPassedForward || cueWasJustPassedBackward)) {
					scrollToChild(itemContainerRef.current)
				}
				prevTimeRef.current = currentTime
			},
			[cueTime, scrollToChild]
		)
	)

	return (
		<div {...props} ref={itemContainerRef} className={className}>
			{children}
		</div>
	)
}

export default React.memo(AutoScrollItem)
