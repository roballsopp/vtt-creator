import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { CuesProvider, CuesFromFileProvider, VideoFileProvider } from '../common';
import { VC as VCIcon } from '../common/icons';
import { VideoDomProvider } from '../common/video';
import Footer from '../footer.component';
import Player from '../player';
import VTTEditor from '../vtt-editor';
import VttMenu from './vtt-menu.component';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flex: 1,
		minHeight: 0,
		minWidth: 0,
	},
	drawer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		zIndex: 1,
	},
	player: {
		flex: 1,
		minHeight: 0,
		minWidth: 0,
	},
});

export default function Editor() {
	const classes = useStyles();

	return (
		<React.Fragment>
			<VideoFileProvider>
				<VideoDomProvider>
					<CuesProvider>
						<CuesFromFileProvider>
							<main className={classes.root}>
								<Paper square className={classes.drawer}>
									<AppBar position="static" color="primary">
										<Toolbar>
											<VCIcon fontSize="large" edge="start" style={{ marginRight: 8 }} />
											<Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
												VTT Creator
											</Typography>
											<VttMenu />
										</Toolbar>
									</AppBar>
									<VTTEditor />
								</Paper>
								<div className={classes.player}>
									<Player />
								</div>
							</main>
						</CuesFromFileProvider>
					</CuesProvider>
				</VideoDomProvider>
			</VideoFileProvider>
			<Footer />
		</React.Fragment>
	);
}
