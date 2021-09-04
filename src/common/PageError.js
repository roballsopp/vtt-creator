import React from 'react'
import {Box, Button, Typography} from '@material-ui/core'
import BrokenIcon from '@material-ui/icons/SentimentVeryDissatisfied'

export default function PageError({retry}) {
	function handleRetry() {
		retry()
	}

	return (
		<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={600}>
			<Box fontSize={100}>
				<BrokenIcon fontSize="inherit" />
			</Box>
			<Typography variant="h6" gutterBottom>
				Yikes! Looks like something went wrong.
			</Typography>
			{!retry && (
				<Typography variant="body1" paragraph>
					We&apos;d really appreciate it if you would{' '}
					<a href="mailto:vttcreator@gmail.com" target="_blank" rel="noreferrer">
						drop us an email
					</a>{' '}
					so we can fix it.
				</Typography>
			)}
			{retry && (
				<React.Fragment>
					<Typography variant="body1" paragraph>
						Try again below or{' '}
						<a href="mailto:vttcreator@gmail.com" target="_blank" rel="noreferrer">
							contact us
						</a>{' '}
						so we can fix the issue.
					</Typography>
					<Button variant="contained" color="secondary" onClick={handleRetry}>
						Reload
					</Button>
				</React.Fragment>
			)}
		</Box>
	)
}
