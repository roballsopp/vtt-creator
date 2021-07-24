import React from 'react'
import {
	Box,
	Button,
	CircularProgress,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Link,
	Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import {makeStyles, styled} from '@material-ui/styles'
import {useAuthDialog} from './auth-dialog-context'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

const useStyles = makeStyles({
	link: {
		cursor: 'pointer',
	},
	goodMessage: {
		color: 'green',
	},
})

VerifyEmailDialog.propTypes = {}

export default function VerifyEmailDialog() {
	const [error, setError] = React.useState('')
	const [resending, setResending] = React.useState(false)
	const classes = useStyles()

	const {resendCode, closeDialog, openLoginDialog} = useAuthDialog()

	const handleResendCode = () => {
		setResending(true)
		resendCode()
			.then(() => {
				setError('')
			})
			.catch(err => {
				setError(err.message)
			})
			.finally(() => setResending(false))
	}

	return (
		<React.Fragment>
			<Title disableTypography>
				<Typography variant="h6">Verify Email</Typography>
				<IconButton aria-label="Close" edge="end" onClick={closeDialog}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Grid container spacing={4} direction="column">
					{error && (
						<Grid item>
							<Typography color="error">{error}</Typography>
						</Grid>
					)}
					{resending && (
						<Grid item>
							<Box display="flex" alignItems="center">
								<Box mr={4}>
									<CircularProgress />
								</Box>
								<Typography>Sending you a new verification link...</Typography>
							</Box>
						</Grid>
					)}
					{!resending && (
						<Grid item>
							<Typography className={classes.goodMessage}>
								We just sent a verification link to your email. Check your inbox!
							</Typography>
						</Grid>
					)}
					<Grid item>
						<Typography>
							Once you&apos;re verified, proceed to login by clicking &ldquo;Take me to Login&rdquo; below.
						</Typography>
					</Grid>
					<Grid item>
						<Typography align="center">
							Didn&apos;t receive a link?{' '}
							<Link className={classes.link} onClick={handleResendCode}>
								Resend it
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeDialog} color="primary">
					Cancel
				</Button>
				<Button color="secondary" variant="contained" onClick={() => openLoginDialog()}>
					Take me to Login
				</Button>
			</DialogActions>
		</React.Fragment>
	)
}
