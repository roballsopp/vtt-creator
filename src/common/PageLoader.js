import React from 'react'
import {Box, CircularProgress} from '@material-ui/core'

export default function PageLoader() {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" height={600}>
			<CircularProgress />
		</Box>
	)
}
