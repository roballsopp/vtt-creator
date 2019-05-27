import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import { makeStyles } from '@material-ui/styles';
import download from 'downloadjs';
import { CuePropType, getVTTFromCues } from '../services/vtt.service';
import CueEditor from './cue-editor.component';

const useStyles = makeStyles({
	container: {
		width: 400,
		height: '100%',
		padding: 16,
	},
	menuIcon: {
		marginRight: 16,
	},
});

VTTEditor.propTypes = {
	cues: PropTypes.arrayOf(CuePropType).isRequired,
	onChange: PropTypes.func.isRequired,
};

export default function VTTEditor({ cues, onChange }) {
	const classes = useStyles();
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null);

	const onChangeCue = i => cue => {
		const newCues = cues.slice();
		newCues[i] = cue;
		onChange(newCues);
	};

	const onAddCue = () => {
		if (cues.length) {
			const lastCue = cues[cues.length - 1];
			return onChange(cues.concat({ startTime: lastCue.endTime, endTime: lastCue.endTime + 2, text: '' }));
		}
		return onChange([{ startTime: 0, endTime: 2, text: '' }]);
	};

	const onRemoveCue = i => () => {
		const newCues = cues.slice();
		newCues.splice(i, 1);
		return onChange(newCues);
	};

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null);
	};

	const onDownloadVTT = () => {
		download(getVTTFromCues(cues), 'my_captions.vtt', 'text/vtt');
		onCloseOptionsMenu();
	};

	return (
		<Paper>
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
			<div className={classes.container}>
				<Grid container spacing={8}>
					{cues.map((cue, i) => {
						return (
							<Grid key={i} item xs={12}>
								<CueEditor cue={cue} cueNumber={i + 1} onChange={onChangeCue(i)} onDelete={onRemoveCue(i)} />
							</Grid>
						);
					})}
					<Grid item xs={12}>
						<Button variant="contained" color="primary" fullWidth onClick={onAddCue}>
							Add Cue
						</Button>
					</Grid>
				</Grid>
			</div>
		</Paper>
	);
}
