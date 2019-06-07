import * as React from 'react';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useVideoDom } from './video-dom.context';
import VideoOverlay from './video-overlay.component';

const useStyles = makeStyles({
	root: {
		position: 'relative',
		backgroundColor: 'black',
	},
	video: {
		height: '100%',
		width: '100%',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
	},
});

Video.propTypes = {
	src: PropTypes.string,
	topElement: PropTypes.node,
	children: PropTypes.node,
	className: PropTypes.string,
};

export default function Video({ src, topElement, children, className }) {
	const classes = useStyles();
	const { onVideoRef, onVideoContainerRef } = useVideoDom();

	return (
		<div ref={onVideoContainerRef} className={clsx(classes.root, className)}>
			<video src={src} ref={onVideoRef} className={classes.video}>
				{children}
			</video>
			<VideoOverlay className={classes.overlay} topElement={topElement} />
		</div>
	);
}
