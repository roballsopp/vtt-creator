import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useAuthDialog } from '../AuthDialog';
import { useUser, Button } from '../common';

const useStyles = makeStyles(theme => ({
	or: {
		margin: theme.spacing(0, 2),
	},
}));

export default function AccountButton() {
	const { openLoginDialog, openSignupDialog } = useAuthDialog();
	const { user, loading } = useUser();

	const classes = useStyles();

	if (user || loading) {
		return (
			<Button name="Account" loading={loading} href="/account" color="secondary" variant="contained">
				Account
			</Button>
		);
	}

	const handleLogin = () => {
		// Can't pass this directly as an onClick handler since it takes an optional string argument, and
		//   blows up if it receives an event object instead.
		openLoginDialog();
	};

	const handleSignUp = () => {
		openSignupDialog();
	};

	return (
		<React.Fragment>
			<Button color="secondary" variant="contained" onClick={handleLogin}>
				Login
			</Button>
			<Typography className={classes.or}>OR</Typography>
			<Button color="secondary" variant="contained" onClick={handleSignUp}>
				Sign Up
			</Button>
		</React.Fragment>
	);
}
