import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GcsUploader from './gcs-uploader.component';

export default function MainScreen() {
	return (
		<React.Fragment>
			<Grid container alignItems="center">
				<Grid item xs={12}>
					<Typography variant="h1" gutterBottom>
						Hi there. Face here.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<GcsUploader />
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
