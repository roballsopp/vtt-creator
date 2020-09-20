import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useAuth } from '../common';
import { LoginUrl, SignupUrl } from '../config';

const useStyles = makeStyles(theme => ({
	or: {
		margin: theme.spacing(0, 1),
	},
}));

export default function AccountButton() {
	const { isAuthenticated } = useAuth();
	const classes = useStyles();

	if (isAuthenticated) {
		return (
			<Button name="Account" href="/account" color="secondary" variant="contained">
				Account
			</Button>
		);
	}

	return (
		<React.Fragment>
			<Button color="secondary" variant="contained" href={LoginUrl} target="_blank">
				Login
			</Button>
			<Typography className={classes.or}>OR</Typography>
			<Button color="secondary" variant="contained" href={SignupUrl} target="_blank">
				Sign Up
			</Button>
		</React.Fragment>
	);
}
