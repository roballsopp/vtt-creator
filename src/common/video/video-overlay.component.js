import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import VideoControls from './video-controls.component';
import { useVideoEvents } from './video-controls.context';

const useStyles = makeStyles({
	root: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		backgroundImage: 'linear-gradient(rgba(0,0,0,0) 70%, rgba(0,0,0,1))',
	},
	controls: {
		padding: 12,
	},
});

VideoOverlay.propTypes = {
	className: PropTypes.string,
};

export default function VideoOverlay({ className }) {
	const [showOverlay, setShowOverlay] = React.useState(true);
	const classes = useStyles();
	const { videoRef } = useVideoEvents();
	const overlayRef = React.useRef();

	React.useEffect(() => {
		let timeoutId;
		const onMouseEnter = () => {
			setShowOverlay(true);
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				setShowOverlay(false);
			}, 4000);
		};

		if (videoRef) {
			videoRef.addEventListener('mouseover', onMouseEnter);
		}

		const overlayEl = overlayRef.current;

		if (overlayEl) {
			overlayEl.addEventListener('mouseover', onMouseEnter);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (videoRef) {
				videoRef.removeEventListener('mouseover', onMouseEnter);
			}
			if (overlayEl) {
				overlayEl.removeEventListener('mouseover', onMouseEnter);
			}
		};
	}, [videoRef]);

	if (!showOverlay) return null;

	return (
		<div className={className}>
			<div ref={overlayRef} className={classes.root}>
				<div />
				<VideoControls className={classes.controls} />
			</div>
		</div>
	);
}
