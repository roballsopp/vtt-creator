import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { useFileSelector, useToast, useVideoFile } from '../common';
import { Video as BaseVideo } from '../common/video';
import VideoOptionsMenu from './video-options-menu.component';
import VttTrack from './vtt-track.component';
import { getSupportedVideoFileExtensions } from '../services/av.service';

const ACCEPT = getSupportedVideoFileExtensions().join(',');

const useStyles = makeStyles({
	loaderRoot: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
});

Video.propTypes = {
	className: PropTypes.any,
};

export default function Video({ className }) {
	const [src, setSrc] = React.useState();
	const classes = useStyles();
	const toast = useToast();
	const { onVideoFile } = useVideoFile();

	const onFilesSelected = React.useCallback(
		e => {
			const [file] = e.target.files;
			onVideoFile(file);
			if (src) URL.revokeObjectURL(src);
			const localUrl = URL.createObjectURL(file);
			setSrc(localUrl);
		},
		[src, onVideoFile]
	);

	const onFileSizeExceeded = React.useCallback(() => {
		toast.error('The file you have selected is too large.');
	}, [toast]);

	const openFileSelector = useFileSelector({ accept: ACCEPT, onFilesSelected, onFileSizeExceeded });

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
		<BaseVideo src={src} className={className} topElement={<VideoOptionsMenu onFilesSelected={onFilesSelected} />}>
			<VttTrack />
		</BaseVideo>
	);
}
