import * as React from 'react'
import {gql, useQuery} from '@apollo/client'
import {useHistory} from 'react-router-dom'
import {MenuItem} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircle'
import SignUpIcon from '@material-ui/icons/PersonAdd'
import PrivacyIcon from '@material-ui/icons/Policy'
import {makeStyles} from '@material-ui/styles'
import {useAuthDialog} from '../AuthDialog'

const useStyles = makeStyles({
	menuIcon: {
		marginRight: 16,
	},
})

export default function VTTMenuLogin() {
	const classes = useStyles()
	const {openLoginDialog, openSignupDialog} = useAuthDialog()
	const history = useHistory()

	const {loading, data} = useQuery(gql`
		query getUser {
			self {
				id
			}
		}
	`)

	const handleLogin = () => {
		// Can't pass this directly as an onClick handler since it takes an optional string argument, and
		//   blows up if it receives an event object instead.
		openLoginDialog()
	}

	const handleSignUp = () => {
		openSignupDialog()
	}

	if (data || loading) {
		return (
			<React.Fragment>
				<MenuItem disabled={loading} onClick={() => history.push('/account')}>
					<AccountIcon className={classes.menuIcon} />
					Account
				</MenuItem>
				<MenuItem onClick={() => history.push('/privacy')}>
					<PrivacyIcon className={classes.menuIcon} />
					Privacy
				</MenuItem>
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			<MenuItem onClick={handleLogin}>
				<AccountIcon className={classes.menuIcon} />
				Login
			</MenuItem>
			<MenuItem onClick={handleSignUp}>
				<SignUpIcon className={classes.menuIcon} />
				Sign Up
			</MenuItem>
			<MenuItem onClick={() => history.push('/privacy')}>
				<PrivacyIcon className={classes.menuIcon} />
				Privacy
			</MenuItem>
		</React.Fragment>
	)
}
