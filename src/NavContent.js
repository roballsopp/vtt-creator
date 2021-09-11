import React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
	content: {
		flexGrow: 1,
		minWidth: 0,
		height: '100%',
		[theme.breakpoints.up('sm')]: {
			paddingTop: 48,
		},
	},
}))

NavContent.propTypes = {
	children: PropTypes.node.isRequired,
}

export default function NavContent({children}) {
	const classes = useStyles()

	return <div className={classes.content}>{children}</div>
}
