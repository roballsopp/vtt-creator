import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { CuesProvider, VideoFileProvider } from './common';
import VttMenu from './vtt-menu.component';
import Player from './player';
import VTTEditor from './vtt-editor';
import { DurationProvider, PlayProgressProvider, VideoDomProvider } from './common/video';
import { PlayerDurationProvider } from './player/player-duration.context';

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
		flex: 1,
	},
	menuIcon: {
		marginRight: 16,
	},
});

export default function MainScreen() {
	const classes = useStyles();

	return (
		<VideoFileProvider>
			<CuesProvider>
				<VideoDomProvider>
					<DurationProvider>
						<PlayerDurationProvider>
							<PlayProgressProvider>
								<div className={classes.root}>
									<Paper square className={classes.drawer}>
										<AppBar position="static" color="primary">
											<Toolbar>
												<Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
													Caption List
												</Typography>
												<VttMenu />
											</Toolbar>
										</AppBar>
										<VTTEditor />
									</Paper>
									<div className={classes.main}>
										<Player />
									</div>
								</div>
							</PlayProgressProvider>
						</PlayerDurationProvider>
					</DurationProvider>
				</VideoDomProvider>
			</CuesProvider>
		</VideoFileProvider>
	);
}
