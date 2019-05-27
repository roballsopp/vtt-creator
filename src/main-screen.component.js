import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Video from './video.component';
import VTTEditor from './vtt-editor';
import { getAudioBlobFromVideo } from './services/av.service';
import { getUploadUrl, initSpeechToTextOp, pollSpeechToTextOp, uploadFile } from './services/rest-api.service';

const useStyles = makeStyles({
	appBarRoot: {
		marginBottom: 16,
	},
	menuButton: {
		marginRight: 16,
	},
	title: {
		flexGrow: 1,
	},
});

export default function MainScreen() {
	const classes = useStyles();
	const [cues, setCues] = React.useState([]);

	const onVideoFileSelected = async file => {
		// const audioBlob = await getAudioBlobFromVideo(file);
		// const { url, filename } = await getUploadUrl();
		// await uploadFile(audioBlob, url);
		// const { operationId } = await initSpeechToTextOp(filename);
		// const operation = await pollSpeechToTextOp(operationId);
	};

	return (
		<React.Fragment>
			<AppBar position="static" color="primary" className={classes.appBarRoot}>
				<Toolbar>
					<IconButton edge="start" color="inherit" className={classes.menuButton} aria-label="Menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" className={classes.title}>
						Caption Editor
					</Typography>
				</Toolbar>
			</AppBar>
			<Grid container spacing={16}>
				<Grid item zeroMinWidth>
					<Video onFileSelected={onVideoFileSelected} />
				</Grid>
				<Grid item>
					<VTTEditor cues={cues} onChange={setCues} />
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
