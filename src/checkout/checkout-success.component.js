import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Loader } from '../common';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
	},
});

export default function CheckoutSuccess() {
	const classes = useStyles();

	React.useEffect(() => {
		window.gtag('event', 'Donate Checkout Success', {
			event_category: 'button_click',
		});

		setTimeout(() => {
			window.close();
		}, 1000);
	}, []);

	return (
		<main className={classes.root}>
			<Loader />
		</main>
	);
}
