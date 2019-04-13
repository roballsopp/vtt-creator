import * as React from 'react';
import Button from '@material-ui/core/Button';

export default function FileSelector() {
	return (
		<React.Fragment>
			<input
				hidden
				accept="image/*"
				id="raised-button-file"
				multiple
				type="file"
			/>
			<label htmlFor="raised-button-file">
				<Button variant="contained" component="span">
					Upload
				</Button>
			</label>
		</React.Fragment>
	)
}