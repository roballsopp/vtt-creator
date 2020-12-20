import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useOverlay } from './overlay.context';
import { useVideoControl } from './video-control-context';

const useStyles = makeStyles({
	root: {
		color: 'white',
		height: '100%',
		width: '100%',
		position: 'relative',
		cursor: 'pointer',
	},
	topGradient: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 100,
		backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0px, rgba(0,0,0,0) 100px)',
	},
	topElement: {
		display: 'flex',
		justifyContent: 'flex-end',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
	},
	bottomElement: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
});

VideoOverlay.propTypes = {
	className: PropTypes.string,
	topElement: PropTypes.node,
};

export default function VideoOverlay({ className, topElement }) {
	const { showOverlay } = useOverlay();
	const { togglePlay } = useVideoControl();
	const classes = useStyles();

	if (!showOverlay) return null;

	return (
		<div className={className}>
			<div className={classes.root} onClick={togglePlay}>
				<div className={classes.topGradient} />
				<div onClick={e => e.stopPropagation()} className={classes.topElement}>
					{topElement}
				</div>
			</div>
		</div>
	);
}
