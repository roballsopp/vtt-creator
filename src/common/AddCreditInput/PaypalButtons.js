import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {useApolloClient, gql} from '@apollo/client'
import {UserContext_userFragment} from '../UserContext/UserContext.graphql'
import {AccountPage_userFragment} from '../../account/AccountPage.graphql'

const PayPalButton = paypal.Buttons.driver('react', {React, ReactDOM})

const CREATE_PAYPAL_ORDER_MUTATION = gql`
	mutation createPaypalOrder($purchaseAmt: Float!) {
		createPaypalOrder(purchaseAmt: $purchaseAmt) {
			orderId
		}
	}
`

const CANCEL_ORDER_MUTATION = gql`
	mutation cancelPaypalOrder($orderId: String!) {
		cancelPaypalOrder(orderId: $orderId) {
			orderId
		}
	}
`

const APPLY_PAYPAL_CREDIT_MUTATION = gql`
	mutation applyPaypalCredit($orderId: String!) {
		capturePaypalOrder(orderId: $orderId) {
			user {
				...UserContext_user
				...AccountPage_user
			}
			order {
				id
				amount
				currencyCode
			}
			paypalErrorCode
		}
	}
	${UserContext_userFragment}
	${AccountPage_userFragment}
`

PaypalButtons.propTypes = {
	purchaseAmt: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	onApprove: PropTypes.func.isRequired,
	onApproved: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
}

export default function PaypalButtons({purchaseAmt, disabled, onApprove, onApproved, onError}) {
	const apolloClient = useApolloClient()
	const actionsRef = React.useRef()

	React.useEffect(() => {
		if (!actionsRef.current) return

		if (disabled) {
			actionsRef.current.disable()
		} else {
			actionsRef.current.enable()
		}
	}, [disabled])

	const handleCreateOrder = async () => {
		window.gtag('event', 'begin_checkout', {
			value: purchaseAmt,
			currency: 'USD',
			items: [{item_id: 'site_credit', item_name: 'Site Credit'}],
		})

		return apolloClient
			.mutate({
				mutation: CREATE_PAYPAL_ORDER_MUTATION,
				variables: {purchaseAmt: Number(purchaseAmt)},
			})
			.then(r => {
				return r.data.createPaypalOrder.orderId
			})
			.catch(err => {
				// we don't need to call handleError here because these errors all go to the onError callback on the PaypalButton
				// this is an apollo error, and it would be nice if parents don't need to figure that out
				throw err.networkError || err.graphQLErrors || err
			})
	}

	const handleInit = (data, actions) => {
		if (disabled) actions.disable()
		actionsRef.current = actions
	}

	const handleCancel = ({orderID}) => {
		return apolloClient.mutate({mutation: CANCEL_ORDER_MUTATION, variables: {orderId: orderID}}).catch(err => {
			// this is an apollo error, and it would be nice if parents don't need to figure that out
			throw err.networkError || err.graphQLErrors || err
		})
	}

	const handleApprove = data => {
		onApprove()
		return apolloClient
			.mutate({mutation: APPLY_PAYPAL_CREDIT_MUTATION, variables: {orderId: data.orderID}})
			.then(r => {
				const {order} = r.data.capturePaypalOrder
				window.gtag('event', 'purchase', {
					transaction_id: order?.id,
					value: order?.amount,
					currency: 'USD',
					items: [{item_id: 'site_credit', item_name: 'Site Credit'}],
				})
				onApproved(r.data.capturePaypalOrder)
			})
			.catch(err => {
				// this is an apollo error, and it would be nice if parents don't need to figure that out
				throw err.networkError || err.graphQLErrors || err
			})
	}

	return (
		<PayPalButton
			shippingPreference="NO_SHIPPING"
			onInit={handleInit}
			createOrder={handleCreateOrder}
			onApprove={handleApprove}
			onCancel={handleCancel}
			onError={onError}
		/>
	)
}
