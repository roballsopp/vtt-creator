import * as React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { AccountButton } from './account';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		zIndex: 1,
		padding: '0 20px',
	},
	footerSection: {
		display: 'flex',
		alignItems: 'center',
	},
	footerDivider: {
		borderLeft: '2px solid white',
		marginLeft: 18,
		width: 20,
		height: 28,
	},
}));

export default function Footer() {
	const classes = useStyles();

	return (
		<Paper square className={classes.root} elevation={8}>
			<div className={classes.footerSection}>
				<Button color="inherit" href="/privacy">
					Privacy
				</Button>
			</div>
			<div className={classes.footerSection}>
				<AccountButton />
			</div>
		</Paper>
	);
}
