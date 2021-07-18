import * as React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import {gql} from '@apollo/client'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles'
import {useAuthDialog} from '../AuthDialog'
import AddCreditInput from './AddCreditInput'
import {VC as VCIcon} from '../common/icons'
import {TranscriptionCost} from '../config'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minHeight: 0,
		minWidth: 0,
	},
	content: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		maxWidth: 960,
		height: '100%',
		margin: 'auto',
		minHeight: 0,
		minWidth: 0,
		padding: theme.spacing(4),
	},
	addCreditSection: {
		border: `1px solid ${theme.palette.grey[300]}`,
	},
}))

AccountPage.fragments = {
	user: gql`
		fragment AccountPageUser on User {
			id
			email
			credit
			unlimitedUsage
			...AddCreditInputUser
		}
		${AddCreditInput.fragments.user}
	`,
}

AccountPage.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		credit: PropTypes.number.isRequired,
		unlimitedUsage: PropTypes.bool,
	}).isRequired,
}

export default function AccountPage({user}) {
	const {logout} = useAuthDialog()
	const classes = useStyles()
	const history = useHistory()

	const handleLogout = () => {
		logout()
		history.push('/editor')
	}

	return (
		<main className={classes.root}>
			<AppBar position="static" color="primary">
				<Toolbar>
					<VCIcon fontSize="large" edge="start" style={{marginRight: 8}} />
					<Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
						VTT Creator
					</Typography>
					<Button color="secondary" variant="contained" href="/editor">
						Editor
					</Button>
				</Toolbar>
			</AppBar>
			<div className={classes.content}>
				<Grid container spacing={6}>
					<Grid item container xs={12}>
						<Box display="flex" flex={1} alignItems="center">
							<Typography variant="h6">Account Email: {user.email}</Typography>
						</Box>
						<Box mr={4}>
							<Button color="secondary" size="large" variant="contained" onClick={handleLogout}>
								Log out
							</Button>
						</Box>
						<Button color="secondary" size="large" variant="contained" href="/privacy">
							Privacy
						</Button>
					</Grid>
					<Grid item container xs={12}>
						<Box flex={1} mr={6}>
							<Grid container spacing={4}>
								<Grid item xs={12}>
									<Typography variant="h6" gutterBottom>
										{user.unlimitedUsage && 'Credit: Unlimited'}
										{!user.unlimitedUsage &&
											`Credit: $${user.credit.toFixed(2)} (${(user.credit / TranscriptionCost).toFixed(1)} minutes)`}
									</Typography>
									<Typography>
										Extracting video captions automatically costs ${TranscriptionCost.toFixed(2)} per minute of video.
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
				</Grid>
			</div>
		</main>
	)
}
