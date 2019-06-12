import * as React from 'react';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDragging, useCue } from '../../common';
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
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};

function CueHandleRight({ onChange, className }) {
	const classes = useStyles();
	const { onDeltaCue } = useCue();
	const [handleRef, setHandleRef] = React.useState();
	const { pixelsPerSec } = useZoom();

	const startPosRef = React.useRef(0);
	const prevPosRef = React.useRef(0);

	const onDragStart = React.useCallback(e => {
		startPosRef.current = e.clientX;
		prevPosRef.current = e.clientX;
	}, []);

	const onDragging = React.useCallback(
		e => {
			onChange(e.clientX - prevPosRef.current);
			prevPosRef.current = e.clientX;
		},
		[onChange]
	);

	const onDragEnd = React.useCallback(
		e => {
			const endDelta = (e.clientX - startPosRef.current) / pixelsPerSec;
			onDeltaCue({ endDelta });
		},
		[pixelsPerSec, onDeltaCue]
	);

	useDragging(handleRef, { onDragStart, onDragging, onDragEnd });

	return (
		<div ref={setHandleRef} className={clsx(classes.root, className)}>
			<div className={classes.borderLine} />
		</div>
	);
}

export default React.memo(CueHandleRight);
