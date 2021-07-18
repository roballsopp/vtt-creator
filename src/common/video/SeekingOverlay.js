import React from 'react'
import clsx from 'clsx'
import CircularProgress from '@material-ui/core/CircularProgress'
import {makeStyles} from '@material-ui/styles'
import {useSeeking} from './seeking-context'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export default function SeekingOverlay({className}) {
	const classes = useStyles()
	const {seeking} = useSeeking()

	if (!seeking) return null

	return (
		<div className={clsx(className, classes.root)}>
			<CircularProgress />
		</div>
	)
}
