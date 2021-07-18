import * as React from 'react'
import {Button} from '../common'

const cancelUrl = encodeURIComponent(`${window.location.origin}/checkout-cancel`)
const successUrl = encodeURIComponent(`${window.location.origin}/checkout-success`)

export default function DonateButton(buttonProps) {
	return (
		<Button
			color="secondary"
			variant="contained"
			{...buttonProps}
			target="_blank"
			href={`https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MY57V99F9H496&source=url&return=${successUrl}&cancel_return=${cancelUrl}`}>
			Donate
		</Button>
	)
}
