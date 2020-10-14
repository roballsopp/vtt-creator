import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useFileSelector, Button, useCueFromFileLoader } from '../common';

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
	const { loadCuesFromFile } = useCueFromFileLoader();

	const onVTTFileSelected = React.useCallback(
		e => {
			loadCuesFromFile(e.target.files[0]);
		},
		[loadCuesFromFile]
	);

	const openFileSelector = useFileSelector({ accept: '.vtt', onFilesSelected: onVTTFileSelected });

	return (
		<div className={classes.root}>
			<Button name="Select VTT File" variant="contained" color="primary" onClick={openFileSelector}>
				Select VTT File
			</Button>
		</div>
	);
}
