import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import useFileSelector from '../use-file-selector.hook';
import VideoOverlay from './video-overlay.component';
import { VideoControlsProvider } from './video-controls.context';

const useStyles = makeStyles({
	container: {
		position: 'relative',
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

Video.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	captionSrc: PropTypes.string,
	onFileSelected: PropTypes.func.isRequired,
};

Video.defaultProps = {
	width: 400,
	height: 300,
};

export default function Video(props) {
	const { captionSrc, onFileSelected } = props;
	const [src, setSrc] = React.useState();
	const classes = useStyles(props);
	const [videoRef, setVideoRef] = React.useState();
	const [videoContainerRef, setVideoContainerRef] = React.useState();

	const onFilesSelected = React.useCallback(
		e => {
			const [file] = e.target.files;
			const localUrl = URL.createObjectURL(file);
			setSrc(localUrl);
			onFileSelected(file);
		},
		[onFileSelected]
	);

	const openFileSelector = useFileSelector({ accept: 'video/*', onFilesSelected });

	return (
		<VideoControlsProvider videoRef={videoRef} videoContainerRef={videoContainerRef}>
			<div ref={setVideoContainerRef} className={classes.container}>
				{!src && (
					<Button variant="contained" color="primary" onClick={openFileSelector}>
						Select Video File
					</Button>
				)}
				{src && (
					<React.Fragment>
						<video ref={setVideoRef} className={classes.video}>
							<source src={src} />
							<track src={captionSrc} default kind="subtitles" srcLang="en" label="English" />
						</video>
						<VideoOverlay className={classes.overlay} videoContainerRef={videoContainerRef} />
					</React.Fragment>
				)}
			</div>
		</VideoControlsProvider>
	);
}
