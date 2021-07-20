import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {useApolloClient, gql} from '@apollo/client'
import {AddCreditInput_userFragment} from './AddCreditInput.graphql'
import {AccountPage_userFragment} from '../AccountPage.graphql'

const PayPalButton = paypal.Buttons.driver('react', {React, ReactDOM})

const CREATE_PAYPAL_ORDER_MUTATION = gql`
	mutation createPaypalOrder($purchaseAmt: Float!) {
		createPaypalOrder(purchaseAmt: $purchaseAmt) {
			orderId
		}
	}
`

// TODO: use the account page and credit input fragments here. its a dep cycle so will have to extract
const APPLY_PAYPAL_CREDIT_MUTATION = gql`
	mutation applyPaypalCredit($orderId: String!) {
		applyCreditFromPaypal(orderId: $orderId) {
			...AddCreditInput_user
			...AccountPage_user
		}
	}
	${AddCreditInput_userFragment}
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
		const {
			data: {createPaypalOrder},
		} = await apolloClient.mutate({
			mutation: CREATE_PAYPAL_ORDER_MUTATION,
			variables: {purchaseAmt: Number(purchaseAmt)},
		})
		return createPaypalOrder.orderId
	}

	const handleInit = (data, actions) => {
		if (disabled) actions.disable()
		actionsRef.current = actions
	}

	const handleApprove = data => {
		onApprove()
		return apolloClient
			.mutate({mutation: APPLY_PAYPAL_CREDIT_MUTATION, variables: {orderId: data.orderID}})
			.then(onApproved)
			.catch(err => {
				// this is an apollo error, and it would be nice if parents don't need to figure that out
				throw err.networkError || err.graphQLErrors || err
			})
	}

	return (
		<PayPalButton
			shippingPreference="NO_SHIPPING"
			createOrder={handleCreateOrder}
			onInit={handleInit}
			onApprove={handleApprove}
			onError={onError}
		/>
	)
}
