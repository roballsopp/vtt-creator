import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useAuthDialog } from '../AuthDialog';

const useStyles = makeStyles(theme => ({
	or: {
		margin: theme.spacing(0, 1),
	},
}));

AccountButton.fragments = {
	user: gql`
		fragment AccountButtonUser on User {
			id
		}
	`,
};

AccountButton.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
};

export default function AccountButton({ user }) {
	const { openLoginDialog, openSignupDialog } = useAuthDialog();
	const classes = useStyles();

	if (user) {
		return (
			<Button name="Account" href="/account" color="secondary" variant="contained">
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
