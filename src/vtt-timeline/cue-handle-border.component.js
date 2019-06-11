import * as React from 'react';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDragging } from '../common';

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		cursor: 'ew-resize',
		width: 20,
		top: 0,
		bottom: 0,
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

CueHandleBorder.propTypes = {
	onDragging: PropTypes.func.isRequired,
	onDragStart: PropTypes.func,
	onDragEnd: PropTypes.func,
	className: PropTypes.string,
};

function CueHandleBorder({ onDragStart, onDragEnd, onDragging, className }) {
	const classes = useStyles();

	const [handleRef, setHandleRef] = React.useState();

	useDragging(handleRef, { onDragging, onDragStart, onDragEnd });

	return (
		<div ref={setHandleRef} className={clsx(classes.root, className)}>
			<div className={classes.borderLine} />
		</div>
	);
}

export default React.memo(CueHandleBorder);
