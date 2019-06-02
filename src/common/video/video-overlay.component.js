import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import VideoControls from './video-controls.component';

const useStyles = makeStyles({
	root: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		backgroundImage: 'linear-gradient(1turn, rgba(0,0,0,1) 0px, rgba(0,0,0,0) 100px)',
	},
});

VideoOverlay.propTypes = {
	className: PropTypes.string,
	videoContainerRef: PropTypes.instanceOf(HTMLElement),
};

export default function VideoOverlay({ className, videoContainerRef }) {
	const [showOverlay, setShowOverlay] = React.useState(true);
	const classes = useStyles();

	React.useEffect(() => {
		let timeoutId;
		const onMouseMove = () => {
			setShowOverlay(true);
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				setShowOverlay(false);
			}, 4000);
		};

		if (videoContainerRef) {
			videoContainerRef.addEventListener('mousemove', onMouseMove); // TODO: throttle
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (videoContainerRef) {
				videoContainerRef.removeEventListener('mousemove', onMouseMove);
			}
		};
	}, [videoContainerRef]);

	if (!showOverlay) return null;

	return (
		<div className={className}>
			<div className={classes.root}>
				<div />
				<VideoControls />
			</div>
		</div>
	);
}
