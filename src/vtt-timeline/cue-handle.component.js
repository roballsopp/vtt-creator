import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useCue } from '../common';
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

function CueHandle({ children }) {
	const { cue, onChangeCueStart, onChangeCueEnd } = useCue();
	const [left, setLeft] = React.useState(0);
	const [right, setRight] = React.useState(0);
	const { pixelsPerSec, zoomContainerRect } = useZoom();
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
			setLeft(e.clientX - containerLeft);
		},
		[containerLeft]
	);

	const onDraggingRight = React.useCallback(
		e => {
			setRight(containerWidth - (e.clientX - containerLeft));
		},
		[containerLeft, containerWidth]
	);

	const onDragEndLeft = React.useCallback(
		e => {
			onChangeCueStart((e.clientX - containerLeft) / pixelsPerSec);
		},
		[containerLeft, pixelsPerSec, onChangeCueStart]
	);

	const onDragEndRight = React.useCallback(
		e => {
			onChangeCueEnd((e.clientX - containerLeft) / pixelsPerSec);
		},
		[containerLeft, pixelsPerSec, onChangeCueEnd]
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

export default React.memo(CueHandle);
