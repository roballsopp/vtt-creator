import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { CuesProvider, VideoFileProvider, DonateButton } from './common';
import { LinkedIn, Github } from './common/icons';
import VttMenu from './vtt-menu.component';
import Player from './player';
import VTTEditor from './vtt-editor';
import { VideoDomProvider } from './common/video';

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
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		zIndex: 1,
		padding: '0 20px',
	},
	footerSection: {
		display: 'flex',
		alignItems: 'center',
	},
	footerDivider: {
		borderLeft: '2px solid white',
		marginLeft: 18,
		width: 20,
		height: 28,
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
							<div className={classes.footerSection}>
								<Typography variant="body2" color="inherit">
									Created by Robert Allsopp
								</Typography>
								<div className={classes.footerDivider} />
								<IconButton
									edge="start"
									size="small"
									component="a"
									color="inherit"
									aria-label="Robert's LinkedIn Profile"
									href="https://www.linkedin.com/in/robertallsopp"
									style={{ marginRight: 12 }}>
									<LinkedIn fontSize="small" />
								</IconButton>
								<IconButton
									size="small"
									component="a"
									color="inherit"
									aria-label="Robert's Github Profile"
									href="https://github.com/roballsopp">
									<Github fontSize="small" />
								</IconButton>
							</div>
							<div className={classes.footerSection}>
								<Typography variant="body2" color="inherit" style={{ marginRight: 20 }}>
									Like this tool? Help me keep it running!
								</Typography>
								<DonateButton />
							</div>
						</Paper>
					</div>
				</VideoDomProvider>
			</CuesProvider>
		</VideoFileProvider>
	);
}
