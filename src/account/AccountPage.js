import React from 'react'
import {useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Box, Button, Grid, Hidden, Typography} from '@material-ui/core'
import {useAuthDialog} from '../AuthDialog'
import AddCreditInput from '../common/AddCreditInput'
import PageContainer from '../common/PageContainer'
import BatchJobHistoryTable from './BatchJobHistoryTableContainer'
import JobHistoryTable from './JobHistoryTableQueryContainer'
import TranslationHistoryTable from './TranslationHistoryTableQueryContainer'
import {AccountPage_userFragment} from './AccountPage.graphql'
import DeleteAccountDialog from './DeleteAccountDialog'

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
	translationRate: PropTypes.number.isRequired,
}

export default function AccountPage({user, transcriptionRate, translationRate}) {
	const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = React.useState(false)
	const {logout} = useAuthDialog()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/editor')
	}

	const handleDeleteAccount = async () => {
		setDeleteAccountDialogOpen(true)
	}

	return (
		<PageContainer>
			<Grid container spacing={6}>
				<Grid item container xs={12}>
					<Box display="flex" flex={1} alignItems="center">
						<Typography variant="h6">Account Email: {user.email}</Typography>
					</Box>
					<Box>
						<Button color="secondary" size="large" variant="contained" onClick={handleLogout}>
							Log out
						</Button>
					</Box>
					<Box ml={2}>
						<Button color="secondary" size="large" variant="contained" onClick={handleDeleteAccount}>
							Delete Account
						</Button>
					</Box>
				</Grid>
				<Grid item xs={12}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={8}>
							<Grid container spacing={4}>
								<Grid item xs={12}>
									<Typography variant="h6" gutterBottom>
										{user.unlimitedUsage && 'Credit: Unlimited'}
										{!user.unlimitedUsage &&
											`Credit: $${user.credit.toFixed(2)} (${user.creditMinutes.toFixed(1)} minutes)`}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography>
										Extracting video captions automatically costs ${transcriptionRate.toFixed(2)} per minute of video.
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography>
										Translating captions costs ${(translationRate * 100).toFixed(2)} per 100 characters of text.
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography>
										More credit can be added here. Just enter how much credit you want to add, and click the button for
										your preferred payment method.
									</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={4}>
							<AddCreditInput />
						</Grid>
					</Grid>
				</Grid>
				<Hidden smDown>
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
					<Grid item container xs={12} direction="column">
						<Box>
							<Typography variant="h6" gutterBottom>
								Translation History
							</Typography>
							<Typography paragraph>
								Translation results are available for download from the Actions menus below for 10 days after the
								translation is completed.
							</Typography>
						</Box>
						<TranslationHistoryTable />
					</Grid>
					<Grid item container xs={12} direction="column">
						<Box>
							<Typography variant="h6" gutterBottom>
								Batch Job History
							</Typography>
							<Typography paragraph>
								Batch job results are available for download from the Actions menus below for 10 days after all jobs are
								completed.
							</Typography>
						</Box>
						<BatchJobHistoryTable />
					</Grid>
				</Hidden>
			</Grid>
			<DeleteAccountDialog open={deleteAccountDialogOpen} onClose={() => setDeleteAccountDialogOpen(false)} />
		</PageContainer>
	)
}
