import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

export default function LoadingUserDialog() {
	return (
		<React.Fragment>
			<DialogContent>
				<Grid container spacing={4} direction="row" alignContent="center">
					<Grid item>
						<CircularProgress />
					</Grid>
					<Grid item>
						<Typography variant="h6">Please wait...</Typography>
					</Grid>
				</Grid>
			</DialogContent>
		</React.Fragment>
	)
}
