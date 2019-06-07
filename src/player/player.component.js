import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { useFileSelector } from '../common';
import { OverlayProvider } from './overlay.context';
import { VideoControlsProvider } from './video-controls.context';
import VideoOptionsMenu from './video-options-menu.component';
import VideoOverlay from './video-overlay.component';
import VttTrack from './vtt-track.component';

const useStyles = makeStyles({
	videoRoot: {
		position: 'relative',
		backgroundColor: 'black',
		width: p => p.width,
		height: p => p.height,
	},
	loaderRoot: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
		width: p => p.width,
		height: p => p.height,
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

Player.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	onFileSelected: PropTypes.func.isRequired,
};

Player.defaultProps = {
	width: 400,
	height: 300,
};

export default function Player(props) {
	const { onFileSelected } = props;
	const [src, setSrc] = React.useState();
	const classes = useStyles(props);
	const [videoRef, setVideoRef] = React.useState();
	const [videoContainerRef, setVideoContainerRef] = React.useState();

	const onFilesSelected = React.useCallback(
		e => {
			const [file] = e.target.files;
			if (src) URL.revokeObjectURL(src);
			const localUrl = URL.createObjectURL(file);
			setSrc(localUrl);
			onFileSelected(file);
		},
		[src, onFileSelected]
	);

	const openFileSelector = useFileSelector({ accept: 'video/*', onFilesSelected });

	if (!src) {
		return (
			<div className={classes.loaderRoot}>
				<Button variant="contained" color="primary" onClick={openFileSelector}>
					Select Video File
				</Button>
			</div>
		);
	}

	return (
		<VideoControlsProvider videoRef={videoRef} videoContainerRef={videoContainerRef}>
			<OverlayProvider>
				<div ref={setVideoContainerRef} className={classes.videoRoot}>
					{/* key is necessary here to tell react to reload the video if src is different: https://stackoverflow.com/a/47382850/2382483 */}
					<video key={src} ref={setVideoRef} className={classes.video}>
						<source src={src} />
						<VttTrack />
					</video>
					<VideoOverlay
						className={classes.overlay}
						videoContainerRef={videoContainerRef}
						topElement={<VideoOptionsMenu onFilesSelected={onFilesSelected} />}
					/>
				</div>
			</OverlayProvider>
		</VideoControlsProvider>
	);
}
