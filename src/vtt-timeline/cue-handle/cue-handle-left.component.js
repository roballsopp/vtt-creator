import * as React from 'react';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDragging } from '../../common';
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

CueHandleLeft.propTypes = {
	cueIndex: PropTypes.number.isRequired,
	onDragging: PropTypes.func.isRequired,
	onChangeCueTiming: PropTypes.func.isRequired,
	className: PropTypes.string,
};

function CueHandleLeft({ cueIndex, onDragging, onChangeCueTiming, className }) {
	const classes = useStyles();
	const [handleRef, setHandleRef] = React.useState();
	const startPosRef = React.useRef(0);
	const prevPosRef = React.useRef(0);
	const { pixelsPerSec } = useZoom();

	useDragging(handleRef, {
		onDragStart: React.useCallback(e => {
			startPosRef.current = e.clientX;
			prevPosRef.current = e.clientX;
		}, []),
		onDragging: React.useCallback(
			e => {
				onDragging(e.clientX - prevPosRef.current);
				prevPosRef.current = e.clientX;
			},
			[onDragging]
		),
		onDragEnd: React.useCallback(
			e => {
				const startDelta = (e.clientX - startPosRef.current) / pixelsPerSec;
				onChangeCueTiming(cueIndex, { startDelta });
			},
			[cueIndex, pixelsPerSec, onChangeCueTiming]
		),
	});

	return (
		<div ref={setHandleRef} className={clsx(classes.root, className)}>
			<div className={classes.borderLine} />
		</div>
	);
}

export default React.memo(CueHandleLeft);
