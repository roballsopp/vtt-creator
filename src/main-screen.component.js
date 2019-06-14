import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { CuesProvider, VideoFileProvider } from './common';
import { LinkedIn, Github } from './common/icons';
import VttMenu from './vtt-menu.component';
import Player from './player';
import VTTEditor from './vtt-editor';
import { VideoDomProvider } from './common/video';
import MoreIcon from '@material-ui/core/SvgIcon/SvgIcon';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	main: {
		flex: 1,
		display: 'flex',
	},
	footer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 64,
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		zIndex: 1,
	},
	footerDivider: {
		borderLeft: '2px solid white',
		marginLeft: 28,
		width: 28,
		height: 36,
	},
	footerButton: {
		marginRight: 20,
	},
	drawer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	player: {
		padding: 8,
		flex: 1,
	},
}));

export default function MainScreen() {
	const classes = useStyles();

	return (
		<VideoFileProvider>
			<CuesProvider>
				<VideoDomProvider>
					<div className={classes.root}>
						<main className={classes.main}>
							<Paper square className={classes.drawer}>
								<AppBar position="static" color="primary">
									<Toolbar>
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
						<Paper square className={classes.footer} elevation={8}>
							<Typography color="inherit">Created by Robert Allsopp</Typography>
							<div className={classes.footerDivider} />
							<IconButton
								edge="start"
								component="a"
								color="inherit"
								aria-label="Robert's LinkedIn Profile"
								href="https://www.linkedin.com/in/robertallsopp"
								style={{ marginRight: 4 }}>
								<LinkedIn />
							</IconButton>
							<IconButton
								component="a"
								color="inherit"
								aria-label="Robert's Github Profile"
								href="https://github.com/roballsopp">
								<Github />
							</IconButton>
						</Paper>
					</div>
				</VideoDomProvider>
			</CuesProvider>
		</VideoFileProvider>
	);
}
