import * as React from 'react';
import ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import { useToast } from './toast-context';
import { handleError } from '../services/error-handler.service';

PayPalButton.propTypes = {
	paymentAmount: PropTypes.string,
	onPaymentSuccess: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
};

export default function PayPalButton(props) {
	const { paymentAmount, onPaymentSuccess, name } = props;
	const toast = useToast();

	const trimCents = amount => {
		const [dollars, cents] = amount.split('.');
		if (!cents) return dollars;
		return `${dollars || ''}.${cents.slice(0, 2)}`;
	};

	const PayPalButtons = window.paypal.Buttons.driver('react', { React, ReactDOM });

	return (
		<PayPalButtons
			onClick={() => {
				window.gtag('event', name, {
					event_category: 'button_click',
				});
			}}
			createOrder={(data, actions) => {
				return actions.order
					.create({
						purchase_units: [
							{
								amount: { value: trimCents(paymentAmount) },
							},
						],
						application_context: { shipping_preference: 'NO_SHIPPING' },
					})
					.catch(err => {
						handleError(err);
						toast.error('Make sure you entered a valid dollar (USD) amount');
					});
			}}
			onCancel={() => {
				window.gtag('event', 'PayPal Cancel', {
					event_category: 'button_click',
				});
			}}
			onError={err => {
				handleError(err);
				toast.error('Uh oh, something went wrong!');
			}}
			onApprove={(data, actions) => {
				return actions.order
					.capture()
					.then(details => {
						if (details.error === 'INSTRUMENT_DECLINED') {
							window.gtag('event', 'PayPal Declined', {
								event_category: 'button_click',
							});
							toast.error('Transaction declined.');
							return actions.restart();
						}
						onPaymentSuccess();
						toast.success('Donation successful. Thanks for your support!');
					})
					.catch(err => {
						handleError(err);
						toast.error('Uh oh, something went wrong!');
					});
			}}
		/>
	);
}
