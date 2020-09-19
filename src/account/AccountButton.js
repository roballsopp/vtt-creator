import * as React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useAuth } from '../common';
import { LoginUrl, SignupUrl } from '../config';

export default function AccountButton() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return (
			<Button name="Account" href="/account" color="secondary" variant="contained">
				Account
			</Button>
		);
	}

	return (
		<ButtonGroup color="secondary" variant="contained">
			<Button name="Login" href={LoginUrl} target="_blank">
				Login
			</Button>
			<Button name="Signup" href={SignupUrl} target="_blank">
				Sign Up
			</Button>
		</ButtonGroup>
	);
}
