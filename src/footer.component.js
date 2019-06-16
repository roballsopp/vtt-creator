import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { DonateButton } from './common';
import { LinkedIn, Github } from './common/icons';
import { donationDisabled } from './config';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: donationDisabled ? 'center' : 'space-between',
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

export default function MainScreen() {
	const classes = useStyles();

	return (
		<Paper square className={classes.root} elevation={8}>
			<div className={classes.footerSection}>
				<Typography variant="body2" color="inherit">
					Created by Robert Allsopp
				</Typography>
				<div className={classes.footerDivider} />
				<IconButton
					edge="start"
					size="small"
					component="a"
					color="inherit"
					aria-label="Robert's LinkedIn Profile"
					href="https://www.linkedin.com/in/robertallsopp"
					style={{ marginRight: 12 }}>
					<LinkedIn fontSize="small" />
				</IconButton>
				<IconButton
					size="small"
					component="a"
					color="inherit"
					aria-label="Robert's Github Profile"
					href="https://github.com/roballsopp">
					<Github fontSize="small" />
				</IconButton>
			</div>
			{!donationDisabled && (
				<div className={classes.footerSection}>
					<Typography variant="body2" color="inherit" style={{ marginRight: 20 }}>
						Like this tool? Help me keep it running!
					</Typography>
					<DonateButton />
				</div>
			)}
		</Paper>
	);
}
