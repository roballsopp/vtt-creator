import * as React from 'react';
import download from 'downloadjs';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Video from './video.component';
import VTTEditor from './vtt-editor';
import { getVTTFromCues } from './services/vtt.service';
import { getAudioBlobFromVideo } from './services/av.service';
import { getUploadUrl, initSpeechToTextOp, pollSpeechToTextOp, uploadFile } from './services/rest-api.service';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		height: '100%',
	},
	drawer: {
		zIndex: 2,
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	main: {
		padding: 8,
	},
	menuIcon: {
		marginRight: 16,
	},
});

export default function MainScreen() {
	const classes = useStyles();
	const [cues, setCues] = React.useState([]);
	const [captionSrc, setCaptionSrc] = React.useState();
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null);
	const [editorOpen, setEditorOpen] = React.useState(true);

	const onCuesChange = newCues => {
		setCues(newCues);
		const vttBlob = getVTTFromCues(newCues);
		const vttBlobUrl = URL.createObjectURL(vttBlob);
		if (captionSrc) URL.revokeObjectURL(captionSrc);
		setCaptionSrc(vttBlobUrl);
	};

	const onVideoFileSelected = async file => {
		// const audioBlob = await getAudioBlobFromVideo(file);
		// const { url, filename } = await getUploadUrl();
		// await uploadFile(audioBlob, url);
		// const { operationId } = await initSpeechToTextOp(filename);
		// const operation = await pollSpeechToTextOp(operationId);
	};

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null);
	};

	const onDownloadVTT = () => {
		download(getVTTFromCues(cues), 'my_captions.vtt', 'text/vtt');
		onCloseOptionsMenu();
	};

	return (
		// overflow: 'hidden' necessary to avoid scroll bars due to negative margins in <Grid />
		<div className={classes.root}>
			<Paper square className={classes.drawer}>
				<AppBar position="static" color="primary">
					<Toolbar>
						<Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
							Caption List
						</Typography>
						<IconButton
							edge="end"
							color="inherit"
							aria-label="Menu"
							onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
							<MoreIcon />
						</IconButton>
						<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
							<MenuItem>
								<CloudUploadIcon className={classes.menuIcon} />
								Load from VTT file...
							</MenuItem>
							<MenuItem>
								<VoiceChatIcon className={classes.menuIcon} />
								Extract from video...
							</MenuItem>
							<MenuItem onClick={onDownloadVTT}>
								<CloudDownloadIcon className={classes.menuIcon} />
								Save to VTT file...
							</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
				<VTTEditor cues={cues} onChange={onCuesChange} />
			</Paper>
			<div className={classes.main}>
				<Video onFileSelected={onVideoFileSelected} captionSrc={captionSrc} />
			</div>
		</div>
	);
}
