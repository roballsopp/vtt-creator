import * as React from 'react';

export default function useDragging(elementRef, { onDragging, onDragStart, onDragEnd }) {
	const [dragging, setDragging] = React.useState(false);

	React.useEffect(() => {
		if (dragging) {
			const onMouseMove = e => {
				onDragging && onDragging(e);
			};
			window.addEventListener('mousemove', onMouseMove);
			return () => {
				window.removeEventListener('mousemove', onMouseMove);
			};
		}
	}, [dragging, onDragging]);

	React.useEffect(() => {
		const onMouseDown = e => {
			setDragging(true);
			onDragStart && onDragStart(e);
		};

		if (elementRef) {
			elementRef.addEventListener('mousedown', onMouseDown);
		}

		return () => {
			if (elementRef) {
				elementRef.removeEventListener('mousedown', onMouseDown);
			}
		};
	}, [elementRef, onDragStart]);

	React.useEffect(() => {
		if (dragging) {
			const onMouseUp = e => {
				setDragging(false);
				onDragEnd && onDragEnd(e);
			};
			window.addEventListener('mouseup', onMouseUp);
			return () => {
				window.removeEventListener('mouseup', onMouseUp);
			};
		}
	}, [dragging, onDragEnd]);

	return [dragging];
}
