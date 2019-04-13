import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import FileSelector from './file-selector.component';

export default function MainScreen() {
	return (
		<React.Fragment>
			<Typography variant="h1" gutterBottom>
				Hi there. Face here.
			</Typography>
			<FileSelector />
		</React.Fragment>
	)
}