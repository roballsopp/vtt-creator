import * as React from 'react';
import * as PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { Button } from '../common';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	banner: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 300,
		backgroundColor: 'gray',
	},
	header: {
		color: 'white',
		width: 700,
		marginRight: 50,
	},
});

Splash.propTypes = {
	history: PropTypes.object.isRequired,
};

export default function Splash({ history }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.banner}>
				<div className={classes.header}>
					<Typography variant="h4">Caption your videos online for free.</Typography>
					<Typography variant="h6">
						VTT Creator is an online editor and visualizer for the WebVTT file format.
					</Typography>
				</div>
				<div>
					<Button size="large" variant="contained" color="secondary" onClick={() => history.push('/editor')}>
						Create Captions
					</Button>
				</div>
			</div>
		</div>
	);
}
