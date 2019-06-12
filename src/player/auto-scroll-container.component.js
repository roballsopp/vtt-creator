import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { usePlayProgress } from '../common/video';

const useStyles = makeStyles({
	root: {
		overflowX: 'scroll',
	},
});

AutoScrollContainer.propTypes = {
	pixelsPerSec: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default function AutoScrollContainer({ pixelsPerSec, children, className, ...props }) {
	const classes = useStyles();
	const { currentTime } = usePlayProgress();
	const scrollPixels = currentTime && pixelsPerSec ? pixelsPerSec * currentTime : 0;

	const [scrollContainerRef, setScrollContainerRef] = React.useState();

	React.useEffect(() => {
		if (scrollContainerRef) {
			scrollContainerRef.scrollTo({ left: scrollPixels, behavior: 'smooth' });
		}
	}, [scrollContainerRef, scrollPixels]);

	return (
		<div {...props} ref={setScrollContainerRef} className={clsx(classes.root, className)}>
			{children}
		</div>
	);
}
