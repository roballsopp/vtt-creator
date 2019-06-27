import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { useCue } from '../../common';
import CueHandleLeft from './cue-handle-left.component';
import CueHandleRight from './cue-handle-right.component';
import CueHandleCenter from './cue-handle-center.component';
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
	centerHandle: {
		position: 'absolute',
		backgroundColor: 'white',
		cursor: 'ew-resize',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
});

CueHandle.propTypes = {
	children: PropTypes.node,
};

export default function CueHandle({ children }) {
	const { cue } = useCue();
	const [pos, setPos] = React.useState({ left: 0, right: 0 });
	const { pixelsPerSec, zoomContainerRect } = useZoom();
	const classes = useStyles();
	const containerWidth = zoomContainerRect ? zoomContainerRect.width : 0;

	React.useEffect(() => {
		if (Number.isFinite(pixelsPerSec) && Number.isFinite(containerWidth)) {
			setPos({
				left: Math.round(cue.startTime * pixelsPerSec),
				right: Math.round(containerWidth - cue.endTime * pixelsPerSec),
			});
		}
	}, [pixelsPerSec, cue.startTime, cue.endTime, containerWidth]);

	const onChangeLeft = React.useCallback(delta => {
		setPos(p => {
			const left = p.left + delta;
			return { ...p, left: left < 0 ? 0 : left };
		});
	}, []);

	const onChangeRight = React.useCallback(delta => {
		setPos(p => ({ ...p, right: p.right - delta }));
	}, []);

	const onSlideCue = React.useCallback(delta => {
		setPos(p => {
			const left = p.left + delta;
			const right = p.right - delta;

			if (left < 0) {
				return {
					left: 0,
					right: p.right + p.left,
				};
			}

			return { left, right };
		});
	}, []);

	return (
		<div className={classes.cue} style={pos}>
			<div className={classes.borderHandleContainer}>
				<div className={classes.content}>{children}</div>
				<CueHandleCenter className={classes.centerHandle} onChange={onSlideCue} />
				<CueHandleLeft className={clsx(classes.edgeHandle, classes.leftHandle)} onChange={onChangeLeft} />
				<CueHandleRight className={clsx(classes.edgeHandle, classes.rightHandle)} onChange={onChangeRight} />
			</div>
		</div>
	);
}
