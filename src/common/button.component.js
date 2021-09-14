import React from 'react'
import * as PropTypes from 'prop-types'
import MuiButton from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

Button.propTypes = {
	...MuiButton.propTypes,
	loading: PropTypes.bool,
	name: PropTypes.string,
}

export default function Button(props) {
	const {children, loading, name, onClick, ...buttonProps} = props

	const handleClick = (...args) => {
		onClick?.(...args)
		window.gtag('event', name, {
			event_category: 'button_click',
		})
	}

	if (loading) {
		return (
			<MuiButton
				{...buttonProps}
				startIcon={<CircularProgress size={20} variant="indeterminate" color="inherit" />}
				disabled>
				{children}
			</MuiButton>
		)
	}

	return (
		<MuiButton onClick={handleClick} {...buttonProps}>
			{children}
		</MuiButton>
	)
}
