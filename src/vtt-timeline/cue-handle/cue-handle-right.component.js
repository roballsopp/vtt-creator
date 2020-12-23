import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDragging } from '../../common';
import { useCueTrack } from '../cue-track-context';
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
	cueIndex: PropTypes.number.isRequired,
	onDragging: PropTypes.func.isRequired,
	onChangeCueTiming: PropTypes.func.isRequired,
	className: PropTypes.string,
};

function CueHandleRight({ cueIndex, onDragging, onChangeCueTiming, className }) {
	const classes = useStyles();
	const [handleRef, setHandleRef] = React.useState();
	const startPosRef = React.useRef(0);
	const prevPosRef = React.useRef(0);
	const didDragRef = React.useRef(false);
	const { pixelsPerSec } = useZoom();
	const { trackEl } = useCueTrack();

	useDragging(handleRef, {
		onDragStart: React.useCallback(
			e => {
				const bbox = trackEl.getBoundingClientRect();
				const relPos = e.clientX - bbox.x;
				startPosRef.current = relPos;
				prevPosRef.current = relPos;
				didDragRef.current = false;
			},
			[trackEl]
		),
		onDragging: React.useCallback(
			e => {
				const bbox = trackEl.getBoundingClientRect();
				const relPos = e.clientX - bbox.x;
				onDragging(relPos - prevPosRef.current);
				prevPosRef.current = relPos;
				didDragRef.current = true;
			},
			[trackEl, onDragging]
		),
		onDragEnd: React.useCallback(
			e => {
				const bbox = trackEl.getBoundingClientRect();
				const relPos = e.clientX - bbox.x;
				const endDelta = (relPos - startPosRef.current) / pixelsPerSec;
				onChangeCueTiming(cueIndex, { endDelta });
			},
			[trackEl, cueIndex, pixelsPerSec, onChangeCueTiming]
		),
	});

	const handleClick = e => {
		// if we performed a drag, don't fire the click event
		if (didDragRef.current) e.stopPropagation();
	};

	return (
		<div ref={setHandleRef} className={clsx(classes.root, className)} onClick={handleClick}>
			<div className={classes.borderLine} />
		</div>
	);
}

export default React.memo(CueHandleRight);
