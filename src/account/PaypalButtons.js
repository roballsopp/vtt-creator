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
	onApprove: PropTypes.func,
};

export default function PaypalButtons({ purchaseAmt, onApprove }) {
	const apolloClient = useApolloClient();

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

	const handleApprove = data => {
		return apolloClient
			.mutate({ mutation: APPLY_PAYPAL_CREDIT_MUTATION, variables: { orderId: data.orderID } })
			.then(result => {
				if (onApprove) onApprove(result);
				return result;
			});
	};

	return <PayPalButton createOrder={handleCreateOrder} onApprove={handleApprove} />;
}
