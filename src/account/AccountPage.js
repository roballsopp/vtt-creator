import * as React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles'
import {useAuthDialog} from '../AuthDialog'
import AddCreditInput from './AddCreditInput'
import PageContainer from '../common/PageContainer'
import JobHistoryTable from './JobHistoryTableQueryContainer'
import {AccountPage_userFragment} from './AccountPage.graphql'

const useStyles = makeStyles(theme => ({
	addCreditSection: {
		border: `1px solid ${theme.palette.grey[300]}`,
	},
}))

AccountPage.fragments = {
	user: AccountPage_userFragment,
}

AccountPage.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		credit: PropTypes.number.isRequired,
		creditMinutes: PropTypes.number.isRequired,
		unlimitedUsage: PropTypes.bool,
	}).isRequired,
	transcriptionRate: PropTypes.number.isRequired,
}

export default function AccountPage({user, transcriptionRate}) {
	const {logout} = useAuthDialog()
	const classes = useStyles()
	const history = useHistory()

	const handleLogout = () => {
		logout()
		history.push('/editor')
	}

	return (
		<PageContainer
			headerRight={
				<Button color="secondary" variant="contained" href="/editor">
					Editor
				</Button>
			}>
			<Grid container spacing={6}>
				<Grid item container xs={12}>
					<Box display="flex" flex={1} alignItems="center">
						<Typography variant="h6">Account Email: {user.email}</Typography>
					</Box>
					<Button color="secondary" size="large" variant="contained" onClick={handleLogout}>
						Log out
					</Button>
				</Grid>
				<Grid item container xs={12}>
					<Box flex={1} mr={6}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<Typography variant="h6" gutterBottom>
									{user.unlimitedUsage && 'Credit: Unlimited'}
									{!user.unlimitedUsage &&
										`Credit: $${user.credit.toFixed(2)} (${user.creditMinutes.toFixed(1)} minutes)`}
								</Typography>
								<Typography>
									Extracting video captions automatically costs ${transcriptionRate.toFixed(2)} per minute of video.
									More credit can be added to the right. Just enter how much credit you want to add, and click the
									button for your preferred payment method.
								</Typography>
							</Grid>
						</Grid>
					</Box>
					<Box width={400} p={4} className={classes.addCreditSection}>
						<AddCreditInput user={user} />
					</Box>
				</Grid>
				<Grid item container xs={12} direction="column">
					<Box>
						<Typography variant="h6" gutterBottom>
							Cue Extraction History
						</Typography>
						<Typography paragraph>
							Cue extraction results are available for download from the Actions menus below for 10 days after the
							extraction job is completed.
						</Typography>
					</Box>
					<JobHistoryTable />
				</Grid>
			</Grid>
		</PageContainer>
	)
}
