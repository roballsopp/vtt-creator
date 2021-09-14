import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles({
	container: {
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default function Loader(props) {
	const classes = useStyles()
	return (
		<div className={classes.container}>
			<CircularProgress {...props} />
		</div>
	)
}
