import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { usePlayProgress } from '../common/video';

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
	const { currentTime } = usePlayProgress();
	const scrollPixels = currentTime && pixelsPerSec ? pixelsPerSec * currentTime : 0;

	const [scrollContainerRef, setScrollContainerRef] = React.useState();

	React.useEffect(() => {
		if (scrollContainerRef) {
			if (horizontal) scrollContainerRef.scrollLeft = scrollPixels;
			else scrollContainerRef.scrollTop = scrollPixels;
		}
	}, [scrollContainerRef, horizontal, scrollPixels]);

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
