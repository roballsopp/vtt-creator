import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FabButton from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import download from 'downloadjs';
import { CuePropType, getVTTFromCues } from '../services/vtt.service';
import CueEditor from './cue-editor.component';
import theme from './mui-theme';

const useStyles = makeStyles({
	root: {
		width: 400,
		padding: 16,
		paddingBottom: 90,
		height: '100%',
		overflowY: 'scroll',
	},
	cueEditor: {
		marginBottom: 12,
	},
	fab: {
		position: 'absolute',
		bottom: 16,
		right: 16,
	},
	fabContainer: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
	},
});

VTTEditor.propTypes = {
	cues: PropTypes.arrayOf(CuePropType).isRequired,
	onChange: PropTypes.func.isRequired,
};

export default function VTTEditor({ cues, onChange }) {
	const classes = useStyles();

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

	return (
		<MuiThemeProvider theme={theme}>
			<div className={classes.fabContainer}>
				<div className={classes.root}>
					<Grid container spacing={1}>
						{cues.map((cue, i) => {
							return (
								<Grid key={i} item xs={12} className={classes.cueEditor}>
									<CueEditor cue={cue} cueNumber={i + 1} onChange={onChangeCue(i)} onDelete={onRemoveCue(i)} />
								</Grid>
							);
						})}
					</Grid>
				</div>
				<FabButton className={classes.fab} color="primary" aria-label="Add Cue" onClick={onAddCue}>
					<AddIcon />
				</FabButton>
			</div>
		</MuiThemeProvider>
	);
}
