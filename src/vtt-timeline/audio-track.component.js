import * as React from 'react';
import * as WaveSurfer from 'wavesurfer.js';
import muiPinks from '@material-ui/core/colors/pink';
import { makeStyles } from '@material-ui/styles';
import { getAudioBlobFromVideo } from '../services/av.service';
import { useVideoFile } from '../common';
import { useZoom } from './zoom-container.component';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		flexDirection: 'column',
	},
});

export default function AudioTrack() {
	const [waveformRef, setWaveformRef] = React.useState();
	const [wavesurfer, setWavesurfer] = React.useState();
	const { videoFile } = useVideoFile();
	const { pixelsPerSec } = useZoom();
	const classes = useStyles();

	React.useEffect(() => {
		if (waveformRef) {
			setWavesurfer(
				WaveSurfer.create({
					container: waveformRef,
					waveColor: muiPinks[400],
					interact: false,
					minPxPerSec: pixelsPerSec,
				})
			);
		}
	}, [waveformRef, pixelsPerSec]);

	React.useEffect(() => {
		const loadAudio = async () => {
			const audioBlob = await getAudioBlobFromVideo(videoFile);
			wavesurfer.loadBlob(new Blob([audioBlob]));
		};

		if (videoFile && wavesurfer) loadAudio();
	}, [videoFile, wavesurfer]);

	return <div ref={setWaveformRef} className={classes.root} />;
}
