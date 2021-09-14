import React from 'react'
import {Box, Button, CircularProgress, Typography} from '@material-ui/core'
import {handleError} from './services/error-handler.service'
import {useAuthDialog} from './AuthDialog'

export default function CheckAuth({children}) {
	const [loading, setLoading] = React.useState(true)
	const [needsLogin, setNeedsLogin] = React.useState(false)
	const {openLoginDialog} = useAuthDialog()

	React.useEffect(() => {
		async function getSession() {
			const {cognitoUserPool} = await import('./cognito')
			const cognitoUser = cognitoUserPool.getCurrentUser()

			if (!cognitoUser) {
				return null
			}

			return new Promise((resolve, reject) => {
				cognitoUser.getSession(function(err, result) {
					if (err) return reject(err)
					resolve(result)
				})
			})
		}

		setLoading(true)
		getSession()
			.then(session => {
				if (!session) {
					setNeedsLogin(true)
					openLoginDialog("You'll need to be logged in to access this page.").then(justLoggedIn => {
						if (justLoggedIn) setNeedsLogin(false)
					})
				} else {
					setNeedsLogin(false)
				}
			})
			.catch(handleError)
			.finally(() => {
				setLoading(false)
			})
	}, [openLoginDialog])

	function handleOpenLoginDialog() {
		openLoginDialog().then(justLoggedIn => {
			if (justLoggedIn) setNeedsLogin(false)
		})
	}

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height={600}>
				<CircularProgress />
			</Box>
		)
	}

	if (needsLogin) {
		return (
			<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={600}>
				<Typography gutterBottom>You&apos;ll need to be logged in to access this page.</Typography>
				<Button variant="contained" color="secondary" onClick={handleOpenLoginDialog}>
					Login
				</Button>
			</Box>
		)
	}

	return children
}
