import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import FileSelector from './file-selector.component';
import { uploadFile } from './services/rest-api.service';
import { useToast } from './toast-context';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
	button: {
		width: 150,
	},
});

const bytesToMB = bytes => {
	return (bytes / 1048576).toFixed(2);
};

export default function GcsUploader() {
	const classes = useStyles();
	const [progress, setProgress] = React.useState(0);
	const [progressMessage, setProgressMessage] = React.useState('');
	const [uploadState, setUploadState] = React.useState();
	const [fileName, setFileName] = React.useState('');
	const toast = useToast();

	const onFileSelected = async file => {
		setFileName(file.name);
		setUploadState('uploading');
		try {
			await uploadFile(file, e => {
				setProgress(100 * (e.loaded / e.total));
				setProgressMessage(`${bytesToMB(e.loaded)} of ${bytesToMB(e.total)} MB`);
			});
			setUploadState('success');
			toast.success('Upload successful!');
		} catch (e) {
			setUploadState('failed');
			toast.error('Oh no! Something went wrong!');
			console.error(e);
		}
	};

	return (
		<div style={{ maxWidth: 500 }}>
			<Grid container alignItems="center" spacing={8}>
				<Grid item>
					<FileSelector
						label={uploadState === 'uploading' ? 'Please Wait...' : 'Select File'}
						disabled={uploadState === 'uploading'}
						onFileSelected={onFileSelected}
						className={classes.button}
					/>
				</Grid>
				{uploadState && (
					<Grid item xs>
						<Grid container spacing={8}>
							<Grid item xs zeroMinWidth>
								<Typography noWrap>{fileName}</Typography>
							</Grid>
							<Grid item>
								<Typography align="right" noWrap>
									{progressMessage}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<LinearProgress variant="determinate" value={progress} />
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		</div>
	);
}
