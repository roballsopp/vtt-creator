import * as React from 'react';
import * as PropTypes from 'prop-types';
import { usePlayProgress } from '../common/video';
import { useAutoScroll } from './auto-scroll.context';

AutoScrollItem.propTypes = {
	cueTime: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default function AutoScrollItem({ cueTime, children, className, ...props }) {
	const { scrollToChild } = useAutoScroll();

	const prevTimeRef = React.useRef(0);
	const [itemContainerRef, setItemContainerRef] = React.useState();

	const onTimeUpdate = currentTime => {
		const cueWasJustPassedForward = currentTime >= cueTime && prevTimeRef.current < cueTime;
		const cueWasJustPassedBackward = currentTime < cueTime && prevTimeRef.current >= cueTime;
		if (itemContainerRef && (cueWasJustPassedForward || cueWasJustPassedBackward)) {
			scrollToChild(itemContainerRef);
		}
		prevTimeRef.current = currentTime;
	};

	usePlayProgress({ onTimeUpdate });

	return (
		<div {...props} ref={setItemContainerRef} className={className}>
			{children}
		</div>
	);
}
