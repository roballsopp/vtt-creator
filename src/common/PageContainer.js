import * as React from 'react'
import * as PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {Box, Link, Typography} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
	scrollContainer: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: 0,
		minWidth: 0,
		overflow: 'auto',
		height: '100%',
	},
	content: {
		flex: 1,
		maxWidth: 960,
		width: '100%',
		margin: 'auto',
		padding: theme.spacing(4),
	},
}))

PageContainer.propTypes = {
	children: PropTypes.node.isRequired,
}

export default function PageContainer({children}) {
	const classes = useStyles()

	return (
		<div className={classes.scrollContainer}>
			<main className={classes.content}>{children}</main>
			<Box component="footer" p={4} display="flex" justifyContent="center">
				<Typography color="primary" variant="subtitle2">
					<Link color="inherit" href="/editor">
						Editor
					</Link>
					&nbsp;|&nbsp;
					<Link color="inherit" href="/account">
						Account
					</Link>
					&nbsp;|&nbsp;
					<Link color="inherit" href="/privacy" target="_blank">
						Privacy
					</Link>
					&nbsp;|&nbsp;
					<Link color="inherit" href="mailto:vttcreator@gmail.com" target="_blank">
						Contact
					</Link>
				</Typography>
			</Box>
		</div>
	)
}
