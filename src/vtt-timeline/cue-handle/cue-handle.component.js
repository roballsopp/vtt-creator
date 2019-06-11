import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { useCue } from '../../common';
import CueHandleLeft from './cue-handle-left.component';
import CueHandleRight from './cue-handle-right.component';
import { useZoom } from '../zoom-container.component';

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
	edgeHandle: {
		position: 'absolute',
		cursor: 'ew-resize',
		width: 20,
		top: 0,
		bottom: 0,
	},
	leftHandle: {
		left: -10,
	},
	rightHandle: {
		right: -10,
	},
});

CueHandle.propTypes = {
	children: PropTypes.node,
};

export default function CueHandle({ children }) {
	const { cue } = useCue();
	const [left, setLeft] = React.useState(0);
	const [right, setRight] = React.useState(0);
	const { pixelsPerSec, zoomContainerRect } = useZoom();
	const classes = useStyles();
	const containerWidth = zoomContainerRect ? zoomContainerRect.width : 0;

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

	return (
		<div className={classes.cue} style={{ left, right }}>
			<div className={classes.borderHandleContainer}>
				<div className={classes.content}>{children}</div>
				<CueHandleLeft className={clsx(classes.edgeHandle, classes.leftHandle)} onChangeLeft={setLeft} />
				<CueHandleRight className={clsx(classes.edgeHandle, classes.rightHandle)} onChangeRight={setRight} />
			</div>
		</div>
	);
}
