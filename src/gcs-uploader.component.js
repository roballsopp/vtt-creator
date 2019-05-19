import * as React from 'react';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import FileSelector from './file-selector.component';
import { getUploadUrl, uploadFile } from './services/rest-api.service';
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

GcsUploader.propTypes = {
	onUploadComplete: PropTypes.func.isRequired,
};

export default function GcsUploader(props) {
	const { onUploadComplete } = props;
	const classes = useStyles();
	const [progress, setProgress] = React.useState(0);
	const [progressMessage, setProgressMessage] = React.useState('');
	const [uploadState, setUploadState] = React.useState();
	const [fileName, setFileName] = React.useState('');
	const toast = useToast();

	const onFileSelected = async file => {
		const { url, filename } = await getUploadUrl();
		setFileName(file.name);
		setUploadState('uploading');
		try {
			await uploadFile(file, url, e => {
				setProgress(100 * (e.loaded / e.total));
				setProgressMessage(`${bytesToMB(e.loaded)} of ${bytesToMB(e.total)} MB`);
			});
			onUploadComplete({ url, filename });
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
						label={uploadState === 'uploading' ? 'Uploading...' : 'Select File'}
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
