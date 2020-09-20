import * as React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { Loader } from '../common';
import { handleError } from '../services/error-handler.service';
import { setAuthToken, setAuthTokenExpiration } from '../services/storage.service';
import { LoginUrl } from '../config';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default function LoginRedirect() {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
	const [error, setError] = React.useState(false);

	React.useEffect(() => {
		if (!location.hash) {
			handleError(new Error('Expected url hash from cognito'));
			return setError(true);
		}

		const tokenMatch = location.hash.match(/id_token=([^&]+)/);
		if (!tokenMatch) {
			handleError(new Error('No token found in hash'));
			return setError(true);
		}

		const expireMatch = location.hash.match(/expires_in=([^&]+)/);
		if (!expireMatch) {
			handleError(new Error('No expiration found in hash'));
			return setError(true);
		}

		try {
			const [, accessToken] = tokenMatch;
			const [, expiresIn] = expireMatch;

			const expiresAt = new Date();
			expiresAt.setSeconds(expiresAt.getSeconds() + Number(expiresIn));

			setAuthToken(accessToken);
			setAuthTokenExpiration(expiresAt);
			window.close();
		} catch (e) {
			console.error('Error saving token or expiration');
			return setError(true);
		}
	}, [history, location.hash]);

	if (error) {
		return (
			<main className={classes.root}>
				<div>
					<Typography>Unable to process login.</Typography>
					<Button variant="contained" color="primary" href={LoginUrl}>
						Try Again
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className={classes.root}>
			<Loader />
		</main>
	);
}
