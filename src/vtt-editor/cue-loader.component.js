import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { useCues, useFileSelector, useToast } from '../common';
import { getCuesFromVTT } from '../services/vtt.service';
import { handleError } from '../services/error-handler.service';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

CueLoader.propTypes = {};

export default function CueLoader() {
	const classes = useStyles();
	const toast = useToast();
	const { onChangeCues, onLoadingCues } = useCues();

	const onVTTFileSelected = React.useCallback(
		async e => {
			onLoadingCues(true);
			try {
				const newCues = await getCuesFromVTT(e.target.files[0]);
				onChangeCues(newCues, true); // check if VTT files require ordering
			} catch (e) {
				handleError(e);
				toast.error('Oh no! An error occurred loading the cues.');
			}
			onLoadingCues(false);
		},
		[onChangeCues, onLoadingCues, toast]
	);

	const openFileSelector = useFileSelector({ accept: '.vtt', onFilesSelected: onVTTFileSelected });

	return (
		<div className={classes.root}>
			<Button variant="contained" color="primary" onClick={openFileSelector}>
				Select VTT File
			</Button>
		</div>
	);
}
