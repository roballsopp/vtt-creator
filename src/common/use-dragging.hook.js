import React from 'react'

export default function useDragging(elementRef, {onDragging, onDragStart, onDragEnd}) {
	const [dragging, setDragging] = React.useState(false)
	const touchMoveRef = React.useRef()

	React.useEffect(() => {
		if (dragging) {
			const onMouseMove = e => {
				onDragging?.(e)
			}

			const onTouchMove = e => {
				touchMoveRef.current = e.touches[0]
				onDragging?.(e.touches[0])
			}

			window.addEventListener('mousemove', onMouseMove)
			window.addEventListener('touchmove', onTouchMove)
			return () => {
				window.removeEventListener('mousemove', onMouseMove)
				window.removeEventListener('touchmove', onTouchMove)
			}
		}
	}, [dragging, onDragging])

	React.useEffect(() => {
		const onMouseDown = e => {
			setDragging(true)
			onDragStart?.(e)
		}

		const onTouchStart = e => {
			setDragging(true)
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
		if (dragging) {
			const onMouseUp = e => {
				setDragging(false)
				onDragEnd?.(e)
			}

			const onTouchEnd = () => {
				setDragging(false)
				// we don't get a touch object with clientX in it on touchend, so we use the last touchmove object instead
				onDragEnd?.(touchMoveRef.current)
			}

			window.addEventListener('mouseup', onMouseUp)
			window.addEventListener('touchend', onTouchEnd)
			return () => {
				window.removeEventListener('mouseup', onMouseUp)
				window.removeEventListener('touchend', onTouchEnd)
			}
		}
	}, [dragging, onDragEnd])

	return [dragging]
}
