import * as React from 'react';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDragging, useCue } from '../../common';
import { usePlayerDuration } from '../../player/player-duration.context';
import { useZoom } from '../zoom-container.component';

const useStyles = makeStyles({
	root: {
		'&:hover div': {
			backgroundColor: 'orange',
		},
	},
	borderLine: {
		height: '100%',
		width: 4,
		margin: 'auto',
		backgroundColor: 'white',
	},
});

CueHandleRight.propTypes = {
	onChangeRight: PropTypes.func.isRequired,
	className: PropTypes.string,
};

function CueHandleRight({ onChangeRight, className }) {
	const classes = useStyles();
	const { onChangeCueEnd } = useCue();
	const [handleRef, setHandleRef] = React.useState();
	const { pixelsPerSec, zoomContainerRect } = useZoom();
	const { duration } = usePlayerDuration();
	const containerWidth = zoomContainerRect ? zoomContainerRect.width : 0;
	const containerLeft = zoomContainerRect ? zoomContainerRect.left : 0;

	const onDragging = React.useCallback(
		e => {
			const newRight = containerWidth - (e.clientX - containerLeft);
			onChangeRight(newRight < 0 ? 0 : newRight);
		},
		[containerLeft, containerWidth, onChangeRight]
	);

	const onDragEnd = React.useCallback(
		e => {
			const seconds = (e.clientX - containerLeft) / pixelsPerSec;
			onChangeCueEnd(seconds > duration ? duration : seconds);
		},
		[containerLeft, pixelsPerSec, onChangeCueEnd, duration]
	);

	useDragging(handleRef, { onDragging, onDragEnd });

	return (
		<div ref={setHandleRef} className={clsx(classes.root, className)}>
			<div className={classes.borderLine} />
		</div>
	);
}

export default React.memo(CueHandleRight);
