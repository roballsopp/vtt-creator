import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Loader, useToast } from '../common';
import { StripeKey } from '../config';
import { handleError } from '../services/error-handler.service';
import { createStripeSession } from '../services/rest-api.service';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
	},
});

Checkout.propTypes = {
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
};

export default function Checkout({ location }) {
	const toast = useToast();
	const classes = useStyles();
	const params = new URLSearchParams(location.search);
	const donationAmount = params.get('donationAmount');

	React.useEffect(() => {
		async function goToCheckout() {
			try {
				const { session } = await createStripeSession({
					name: 'Donation',
					description: 'Thanks for your support!',
					amount: Math.round(Number(donationAmount) * 100),
					returnUrl: `${window.location.origin}/checkout-return`,
				});

				const stripe = Stripe(StripeKey);
				const result = await stripe.redirectToCheckout({ sessionId: session.id });
				if (result.error) throw result.error;
			} catch (e) {
				handleError(e);
				toast.error('Something went wrong!');
			}
		}

		goToCheckout();
	}, [donationAmount, toast]);

	return (
		<div className={classes.root}>
			<Loader />
		</div>
	);
}
