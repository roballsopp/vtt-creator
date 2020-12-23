import * as React from 'react';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDragging } from '../../common';
import { useZoom } from '../zoom-container.component';

const useStyles = makeStyles({
	root: {
		opacity: 0,
		'&:hover': {
			opacity: 0.05,
		},
	},
});

CueHandleCenter.propTypes = {
	cueIndex: PropTypes.number.isRequired,
	onDragging: PropTypes.func.isRequired,
	onChangeCueTiming: PropTypes.func.isRequired,
	className: PropTypes.string,
};

function CueHandleCenter({ cueIndex, onDragging, onChangeCueTiming, className }) {
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
				const d = (e.clientX - startPosRef.current) / pixelsPerSec;
				onChangeCueTiming(cueIndex, { startDelta: d, endDelta: d });
			},
			[cueIndex, pixelsPerSec, onChangeCueTiming]
		),
	});

	return <div ref={setHandleRef} className={clsx(classes.root, className)} />;
}

export default React.memo(CueHandleCenter);
