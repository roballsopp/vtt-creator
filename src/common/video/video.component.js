import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useVideoDom } from './video-dom.context';
import VideoOverlay from './video-overlay.component';
import SeekingOverlay from './SeekingOverlay';

const useStyles = makeStyles({
	root: {
		position: 'relative',
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
	const { onVideoRef } = useVideoDom();

	return (
		<div className={clsx(classes.root, className)}>
			<video src={src} ref={onVideoRef} className={classes.video}>
				{children}
			</video>
			<VideoOverlay className={classes.overlay} topElement={topElement} />
			<SeekingOverlay className={classes.overlay} />
		</div>
	);
}
