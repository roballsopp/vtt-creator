import * as React from 'react'
import PropTypes from 'prop-types'
import {Box} from '@material-ui/core'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import yellow from '@material-ui/core/colors/yellow'
import grey from '@material-ui/core/colors/grey'

StatusBubble.propTypes = {
	status: PropTypes.oneOf(['pending', 'cancelled', 'error', 'success']).isRequired,
}

export default function StatusBubble({status}) {
	return <Box width={14} height={14} borderRadius={7} mr={2} bgcolor={getColor(status)} display="inline-block" />
}

function getColor(status) {
	switch (status) {
		case 'pending':
			return yellow[600]
		case 'cancelled':
			return grey[400]
		case 'error':
			return red[500]
		case 'success':
			return green[500]
		default:
			return ''
	}
}
