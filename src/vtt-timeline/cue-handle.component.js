import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useCue } from '../common';
import { usePlayerDuration } from '../player/player-duration.context';
import CueHandleBorder from './cue-handle-border.component';
import { useZoom } from './zoom-container.component';

const useStyles = makeStyles({
	cue: {
		position: 'absolute',
		top: 0,
		bottom: 0,
	},
	borderHandleContainer: {
		position: 'relative',
		height: '100%',
	},
	content: {
		height: '100%',
	},
	leftBorder: {
		left: -10,
	},
	rightBorder: {
		right: -10,
	},
});

CueHandle.propTypes = {
	children: PropTypes.node,
};

export default function CueHandle({ children }) {
	const { cue, onChangeCueStart, onChangeCueEnd } = useCue();
	const [left, setLeft] = React.useState(0);
	const [right, setRight] = React.useState(0);
	const { pixelsPerSec, zoomContainerRect } = useZoom();
	const { duration } = usePlayerDuration();
	const classes = useStyles();
	const containerWidth = zoomContainerRect ? zoomContainerRect.width : 0;
	const containerLeft = zoomContainerRect ? zoomContainerRect.left : 0;

	React.useEffect(() => {
		if (pixelsPerSec) {
			setLeft(Math.round(cue.startTime * pixelsPerSec));
		}
	}, [pixelsPerSec, cue.startTime]);

	React.useEffect(() => {
		if (pixelsPerSec) {
			setRight(Math.round(containerWidth - cue.endTime * pixelsPerSec));
		}
	}, [pixelsPerSec, cue.endTime, containerWidth]);

	const onDraggingLeft = React.useCallback(
		e => {
			const newLeft = e.clientX - containerLeft;
			setLeft(newLeft < 0 ? 0 : newLeft);
		},
		[containerLeft]
	);

	const onDraggingRight = React.useCallback(
		e => {
			const newRight = containerWidth - (e.clientX - containerLeft);
			setRight(newRight < 0 ? 0 : newRight);
		},
		[containerLeft, containerWidth]
	);

	const onDragEndLeft = React.useCallback(
		e => {
			const seconds = (e.clientX - containerLeft) / pixelsPerSec;
			onChangeCueStart(seconds < 0 ? 0 : seconds);
		},
		[containerLeft, pixelsPerSec, onChangeCueStart]
	);

	const onDragEndRight = React.useCallback(
		e => {
			const seconds = (e.clientX - containerLeft) / pixelsPerSec;
			onChangeCueEnd(seconds > duration ? duration : seconds);
		},
		[containerLeft, pixelsPerSec, onChangeCueEnd, duration]
	);

	return (
		<div className={classes.cue} style={{ left, right }}>
			<div className={classes.borderHandleContainer}>
				<div className={classes.content}>{children}</div>
				<CueHandleBorder className={classes.leftBorder} onDragging={onDraggingLeft} onDragEnd={onDragEndLeft} />
				<CueHandleBorder className={classes.rightBorder} onDragging={onDraggingRight} onDragEnd={onDragEndRight} />
			</div>
		</div>
	);
}
