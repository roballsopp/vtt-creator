import * as React from 'react'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles'
import {AccountButton} from './account'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		zIndex: 1,
		padding: theme.spacing(2, 4),
	},
	leftSection: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	centerSection: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rightSection: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	footerDivider: {
		borderLeft: '2px solid white',
		marginLeft: 18,
		width: 20,
		height: 28,
	},
}))

export default function Footer() {
	const classes = useStyles()

	return (
		<Paper square className={classes.root} elevation={8} component="footer">
			<div className={classes.leftSection} />
			<div className={classes.centerSection}>
				<Typography color="inherit" variant="subtitle2">
					<Link color="inherit" href="/privacy" target="_blank">
						Privacy
					</Link>
					&nbsp;|&nbsp;
					<Link color="inherit" href="mailto:vttcreator@gmail.com" target="_blank">
						Contact
					</Link>
				</Typography>
			</div>
			<div className={classes.rightSection}>
				<AccountButton />
			</div>
		</Paper>
	)
}
