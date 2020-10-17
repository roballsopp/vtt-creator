import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useApolloClient, gql } from '@apollo/client';

const PayPalButton = paypal.Buttons.driver('react', { React, ReactDOM });

const APPLY_PAYPAL_CREDIT_MUTATION = gql`
	mutation applyPaypalCredit($orderId: String!) {
		applyCreditFromPaypal(orderId: $orderId) {
			id
			email
			credit
		}
	}
`;

PaypalButtons.propTypes = {
	purchaseAmt: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	onApprove: PropTypes.func.isRequired,
	onApproved: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
};

export default function PaypalButtons({ purchaseAmt, disabled, onApprove, onApproved, onError }) {
	const apolloClient = useApolloClient();
	const actionsRef = React.useRef();

	React.useEffect(() => {
		if (!actionsRef.current) return;

		if (disabled) {
			actionsRef.current.disable();
		} else {
			actionsRef.current.enable();
		}
	}, [disabled]);

	const handleCreateOrder = (data, actions) => {
		return actions.order.create({
			purchase_units: [
				{
					amount: {
						value: purchaseAmt,
					},
				},
			],
			application_context: {
				shipping_preference: 'NO_SHIPPING',
			},
		});
	};

	const handleInit = (data, actions) => {
		if (disabled) actions.disable();
		actionsRef.current = actions;
	};

	const handleApprove = (data, actions) => {
		onApprove();
		return actions.order
			.capture()
			.then(() => {
				return apolloClient.mutate({ mutation: APPLY_PAYPAL_CREDIT_MUTATION, variables: { orderId: data.orderID } });
			})
			.then(result => {
				onApproved(result);
				return result;
			})
			.catch(err => {
				// this is an apollo error, and it would be nice if parents don't need to figure that out
				throw err.networkError || err.graphQLErrors || err;
			});
	};

	return (
		<PayPalButton
			shippingPreference="NO_SHIPPING"
			createOrder={handleCreateOrder}
			onInit={handleInit}
			onApprove={handleApprove}
			onError={onError}
		/>
	);
}
