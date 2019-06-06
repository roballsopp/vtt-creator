import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import VideoControls from './video-controls.component';
import { useVideoEvents } from './video-controls.context';
import { useOverlay } from './overlay.context';

const useStyles = makeStyles({
	root: {
		color: 'white',
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		backgroundImage: 'linear-gradient(1turn, rgba(0,0,0,1) 0px, rgba(0,0,0,0) 100px)',
	},
	topElement: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
});

VideoOverlay.propTypes = {
	className: PropTypes.string,
	topElement: PropTypes.node,
	videoContainerRef: PropTypes.instanceOf(HTMLElement),
};

export default function VideoOverlay({ className, topElement, videoContainerRef }) {
	const { showOverlay, onStartOverlayTimeout } = useOverlay();
	const classes = useStyles();
	const { onPlayPause } = useVideoEvents();

	React.useEffect(() => {
		if (videoContainerRef) {
			videoContainerRef.addEventListener('mousemove', onStartOverlayTimeout);
		}

		return () => {
			if (videoContainerRef) {
				videoContainerRef.removeEventListener('mousemove', onStartOverlayTimeout);
			}
		};
	}, [onStartOverlayTimeout, videoContainerRef]);

	if (!showOverlay) return null;

	return (
		<div className={className}>
			<div className={classes.root} onClick={onPlayPause}>
				<div onClick={e => e.stopPropagation()} className={classes.topElement}>
					{topElement}
				</div>
				<VideoControls onClick={e => e.stopPropagation()} />
			</div>
		</div>
	);
}
