import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Loader } from '../common';
import { clearAuth } from '../services/storage.service';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
	},
});

export default function LogoutRedirect() {
	const classes = useStyles();
	const history = useHistory();

	React.useEffect(() => {
		clearAuth();
		history.push('/editor');
	}, [history]);

	return (
		<main className={classes.root}>
			<Loader />
		</main>
	);
}
