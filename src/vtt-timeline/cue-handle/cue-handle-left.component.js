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

CueHandleLeft.propTypes = {
	onChangeLeft: PropTypes.func.isRequired,
	className: PropTypes.string,
};

function CueHandleLeft({ onChangeLeft, className }) {
	const classes = useStyles();
	const { onChangeCueStart } = useCue();
	const [handleRef, setHandleRef] = React.useState();
	const { pixelsPerSec, zoomContainerRect } = useZoom();
	const containerLeft = zoomContainerRect ? zoomContainerRect.left : 0;

	const onDragging = React.useCallback(
		e => {
			const newLeft = e.clientX - containerLeft;
			onChangeLeft(newLeft < 0 ? 0 : newLeft);
		},
		[containerLeft, onChangeLeft]
	);

	const onDragEnd = React.useCallback(
		e => {
			const seconds = (e.clientX - containerLeft) / pixelsPerSec;
			onChangeCueStart(seconds < 0 ? 0 : seconds);
		},
		[containerLeft, pixelsPerSec, onChangeCueStart]
	);

	useDragging(handleRef, { onDragging, onDragEnd });

	return (
		<div ref={setHandleRef} className={clsx(classes.root, className)}>
			<div className={classes.borderLine} />
		</div>
	);
}

export default React.memo(CueHandleLeft);
