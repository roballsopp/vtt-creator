import * as React from 'react'
import * as PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {AppBar, Box, Link, Toolbar, Typography} from '@material-ui/core'
import {VC as VCIcon} from './icons'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	scrollContainer: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		minHeight: 0,
		minWidth: 0,
		overflow: 'auto',
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
	headerRight: PropTypes.node,
}

export default function PageContainer({children, headerRight}) {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<AppBar position="static" color="primary">
				<Toolbar>
					<VCIcon fontSize="large" edge="start" style={{marginRight: 8}} />
					<Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
						VTT Creator
					</Typography>
					{headerRight}
				</Toolbar>
			</AppBar>
			<div className={classes.scrollContainer}>
				<main className={classes.content}>{children}</main>
				<Box component="footer" p={4} display="flex" justifyContent="center">
					<Typography color="primary" variant="subtitle2">
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
		</div>
	)
}
