import React from 'react'

export default function useDragging(elementRef, {onDragging, onDragStart, onDragEnd}) {
	const draggingRef = React.useRef(false)
	const touchMoveRef = React.useRef()

	React.useEffect(() => {
		const onMouseMove = e => {
			if (draggingRef.current) onDragging?.(e)
		}

		const onTouchMove = e => {
			if (draggingRef.current) {
				touchMoveRef.current = e.touches[0]
				onDragging?.(e.touches[0])
			}
		}

		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('touchmove', onTouchMove)
		return () => {
			window.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('touchmove', onTouchMove)
		}
	}, [onDragging])

	React.useEffect(() => {
		const onMouseDown = e => {
			draggingRef.current = true
			onDragStart?.(e)
		}

		const onTouchStart = e => {
			draggingRef.current = true
			onDragStart?.(e.touches[0])
		}

		if (elementRef) {
			elementRef.addEventListener('mousedown', onMouseDown)
			elementRef.addEventListener('touchstart', onTouchStart)
		}

		return () => {
			if (elementRef) {
				elementRef.removeEventListener('mousedown', onMouseDown)
				elementRef.removeEventListener('touchstart', onTouchStart)
			}
		}
	}, [elementRef, onDragStart])

	React.useEffect(() => {
		const onMouseUp = e => {
			if (draggingRef.current) {
				draggingRef.current = false
				onDragEnd?.(e)
			}
		}

		const onTouchEnd = () => {
			if (draggingRef.current) {
				draggingRef.current = false
				// we don't get a touch object with clientX in it on touchend, so we use the last touchmove object instead
				onDragEnd?.(touchMoveRef.current)
			}
		}

		window.addEventListener('mouseup', onMouseUp)
		window.addEventListener('touchend', onTouchEnd)
		return () => {
			window.removeEventListener('mouseup', onMouseUp)
			window.removeEventListener('touchend', onTouchEnd)
		}
	}, [onDragEnd])
}
