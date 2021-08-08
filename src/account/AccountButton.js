import * as React from 'react'
import {gql, useQuery} from '@apollo/client'
import {Hidden, IconButton, Menu, MenuItem, Tooltip, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import AccountIcon from '@material-ui/icons/AccountCircle'
import {useAuthDialog} from '../AuthDialog'
import {Button} from '../common'

const useStyles = makeStyles(theme => ({
	or: {
		margin: theme.spacing(0, 2),
	},
}))

export default function AccountButton() {
	const {openLoginDialog, openSignupDialog} = useAuthDialog()

	const {loading, data} = useQuery(gql`
		query getUser {
			self {
				id
			}
		}
	`)

	const classes = useStyles()

	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null)
	}

	if (data || loading) {
		return (
			<React.Fragment>
				<Hidden smUp>
					<IconButton color="inherit" aria-label="Account" href="/account">
						<AccountIcon />
					</IconButton>
				</Hidden>
				<Hidden smDown>
					<Button name="Account" loading={loading} href="/account" color="secondary" variant="contained">
						Account
					</Button>
				</Hidden>
			</React.Fragment>
		)
	}

	const handleLogin = () => {
		// Can't pass this directly as an onClick handler since it takes an optional string argument, and
		//   blows up if it receives an event object instead.
		openLoginDialog()
	}

	const handleSignUp = () => {
		openSignupDialog()
	}

	return (
		<React.Fragment>
			<Hidden smDown>
				<Button color="secondary" variant="contained" onClick={handleLogin}>
					Login
				</Button>
				<Typography className={classes.or}>OR</Typography>
				<Button color="secondary" variant="contained" onClick={handleSignUp}>
					Sign Up
				</Button>
			</Hidden>
			<Hidden smUp>
				<Tooltip title="Account Menu">
					<IconButton color="inherit" aria-label="Account" onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
						<AccountIcon />
					</IconButton>
				</Tooltip>
				<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
					<MenuItem onClick={handleLogin}>Login</MenuItem>
					<MenuItem onClick={handleSignUp}>Sign Up</MenuItem>
				</Menu>
			</Hidden>
		</React.Fragment>
	)
}
