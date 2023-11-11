import React from 'react'
import * as PropTypes from 'prop-types'
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'
import {Button} from '../common'
import {gql, useApolloClient} from '@apollo/client'
import {useAuthDialog} from '../AuthDialog'
import {useNavigate} from 'react-router-dom'

DeleteAccountDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
}

export default function DeleteAccountDialog({open, onClose}) {
	const apolloClient = useApolloClient()
	const {logout} = useAuthDialog()
	const navigate = useNavigate()

	const handleDeleteAccount = async () => {
		await apolloClient.mutate({
			mutation: gql`
				mutation deleteAccount {
					deleteMe {
						userId
					}
				}
			`,
		})
		logout()
		onClose()
		navigate('/editor')
	}

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} aria-labelledby="delete-account-dialog-title">
			<DialogTitle id="delete-account-dialog-title">Delete your account?</DialogTitle>
			<DialogContent>
				This action will permanently delete your user account with VTT Creator. Any credit remaining on your account
				will be lost. Are you sure you want to proceed?
			</DialogContent>
			<DialogActions>
				<Button name="Delete Account Cancel" onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button name="Delete Account Confirm" onClick={handleDeleteAccount} color="primary" variant="contained">
					Yes, Delete My Account
				</Button>
			</DialogActions>
		</Dialog>
	)
}
