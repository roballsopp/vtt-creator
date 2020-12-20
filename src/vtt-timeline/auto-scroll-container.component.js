import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { usePlayTimeEvent } from '../common/video';

const useStyles = makeStyles({
	root: {
		overflowY: 'scroll',
		scrollBehavior: 'smooth',
	},
	horizontalRoot: {
		overflowX: 'scroll',
		scrollBehavior: 'smooth',
	},
});

AutoScrollContainer.propTypes = {
	pixelsPerSec: PropTypes.number.isRequired,
	horizontal: PropTypes.bool,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default function AutoScrollContainer({ pixelsPerSec, horizontal, children, className, ...props }) {
	const classes = useStyles();

	const [scrollContainerRef, setScrollContainerRef] = React.useState();

	usePlayTimeEvent(
		React.useCallback(
			currentTime => {
				const scrollPixels = currentTime && pixelsPerSec ? pixelsPerSec * currentTime : 0;
				if (scrollContainerRef) {
					if (horizontal) scrollContainerRef.scrollLeft = scrollPixels;
					else scrollContainerRef.scrollTop = scrollPixels;
				}
			},
			[horizontal, pixelsPerSec, scrollContainerRef]
		)
	);

	return (
		<div
			{...props}
			ref={setScrollContainerRef}
			className={clsx(
				{
					[classes.root]: !horizontal,
					[classes.horizontalRoot]: horizontal,
				},
				className
			)}>
			{children}
		</div>
	);
}
