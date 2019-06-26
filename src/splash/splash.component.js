import * as React from 'react';
import * as PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import MemoryIcon from '@material-ui/icons/Memory';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Button } from '../common';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
	},
	banner: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 300,
		width: '100%',
		backgroundColor: 'gray',
	},
	bannerInfo: {
		display: 'flex',
		justifyContent: 'space-between',
		width: 1024,
		color: 'white',
	},
	bannerButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	features: {
		display: 'flex',
		justifyContent: 'space-between',
		width: 1024,
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
			<div className={classes.banner}>
				<div className={classes.bannerInfo}>
					<div>
						<Typography variant="h4">Caption your videos online for free.</Typography>
						<Typography variant="h6">
							VTT Creator is an online editor and visualizer for the WebVTT file format.
						</Typography>
					</div>
					<div className={classes.bannerButton}>
						<Button size="large" variant="contained" color="secondary" onClick={() => history.push('/editor')}>
							Create Captions
						</Button>
					</div>
				</div>
			</div>
			<div className={classes.content}>
				<div className={classes.features}>
					<div className={classes.feature}>
						<SubtitlesIcon className={classes.featureIcon} />
						<Typography variant="h6">
							Load a video, and see your captions in action as you edit.
						</Typography>
					</div>
					<div className={classes.feature}>
						<MemoryIcon className={classes.featureIcon} />
						<Typography variant="h6">
							Leverage machine learning to automatically extract captions directly from your video.
						</Typography>
					</div>
					<div className={classes.feature}>
						<CloudDownloadIcon className={classes.featureIcon} />
						<Typography variant="h6">
							Export your work to a .vtt file for use anywhere on the web.
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
}
