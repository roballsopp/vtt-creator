import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import muiBlueGreys from '@material-ui/core/colors/blueGrey';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import MemoryIcon from '@material-ui/icons/Memory';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import { Button } from '../common';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
	},
	toolbar: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: 'auto',
		width: 1024,
		height: 64,
	},
	title: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	banner: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 300,
		width: '100%',
		backgroundPosition: 'center top',
		backgroundColor: muiBlueGreys[900],
	},
	bannerInfo: {
		display: 'flex',
		justifyContent: 'space-between',
		width: 1024,
		color: 'white',
	},
	bannerButtonContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bannerButton: {
		padding: '16px 36px',
		fontSize: 18,
	},
	content: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
	},
	features: {
		display: 'flex',
		justifyContent: 'space-between',
		width: 1024,
		margin: '50px 0',
	},
	feature: {
		width: 300,
		textAlign: 'center',
	},
	featureIcon: {
		fontSize: 80,
	},
});

Splash.propTypes = {
	history: PropTypes.object.isRequired,
};

export default function Splash({ history }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<AppBar position="static" color="primary">
				<div className={classes.toolbar}>
					<div className={classes.title}>
						<ClosedCaptionIcon fontSize="large" style={{ marginRight: 8 }} />
						<Typography variant="h6" color="inherit">
							VTT Creator
						</Typography>
					</div>
				</div>
			</AppBar>
			<div className={classes.banner}>
				<div className={classes.bannerInfo}>
					<div>
						<Typography variant="h4">Caption your videos online.</Typography>
						<Typography variant="h6">
							VTT Creator is an online editor and visualizer for the WebVTT file format.
						</Typography>
					</div>
					<div className={classes.bannerButtonContainer}>
						<Button
							size="large"
							variant="contained"
							color="secondary"
							onClick={() => history.push('/editor')}
							className={classes.bannerButton}>
							Create Captions
						</Button>
					</div>
				</div>
			</div>
			<div className={classes.content}>
				<div className={classes.features}>
					<div className={classes.feature}>
						<SubtitlesIcon className={classes.featureIcon} />
						<Typography variant="h6">Load a video, and see your captions in action as you edit.</Typography>
					</div>
					<div className={classes.feature}>
						<MemoryIcon className={classes.featureIcon} />
						<Typography variant="h6">
							Leverage machine learning to automatically extract captions directly from your video.
						</Typography>
					</div>
					<div className={classes.feature}>
						<CloudDownloadIcon className={classes.featureIcon} />
						<Typography variant="h6">Export your work to a .vtt file for use anywhere on the web.</Typography>
					</div>
				</div>
			</div>
		</div>
	);
}
