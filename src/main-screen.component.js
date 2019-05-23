import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GcsUploader from './gcs-uploader.component';
import { initSpeechToTextOp, pollSpeechToTextOp } from './services/rest-api.service';

export default function MainScreen() {
	const onUploadComplete = async ({ filename }) => {
		const { operationId } = await initSpeechToTextOp(filename);
		const operation = await pollSpeechToTextOp(operationId);
	};

	return (
		<React.Fragment>
			<Grid container alignItems="center">
				<Grid item xs={12}>
					<Typography variant="h1" gutterBottom>
						Hi there. Face here.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<GcsUploader onUploadComplete={onUploadComplete} />
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
