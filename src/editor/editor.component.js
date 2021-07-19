import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles'
import {CuesProvider, CuesFromFileProvider, VideoFileProvider} from '../common'
import {VC as VCIcon} from '../common/icons'
import {
	DurationProvider,
	PlayTimeProvider,
	VideoDomProvider,
	KeyboardControlProvider,
	VideoControlProvider,
} from '../common/video'
import Footer from '../footer.component'
import Player from '../player'
import VTTEditor from '../vtt-editor'
import {ExtractFromVideoDialogs, ExtractFromVideoProvider} from './CueExtractionButton'
import VttMenu from './vtt-menu.component'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minHeight: 0,
		minWidth: 0,
	},
	main: {
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
})

export default function Editor() {
	const classes = useStyles()

	return (
		<React.Fragment>
			<VideoFileProvider>
				<VideoDomProvider>
					<PlayTimeProvider>
						<DurationProvider>
							<VideoControlProvider>
								<KeyboardControlProvider>
									<CuesProvider>
										<CuesFromFileProvider>
											<div className={classes.root}>
												<main className={classes.main}>
													<Paper square className={classes.drawer}>
														<ExtractFromVideoProvider>
															<AppBar position="static" color="primary">
																<Toolbar>
																	<VCIcon fontSize="large" edge="start" style={{marginRight: 8}} />
																	<Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
																		VTT Creator
																	</Typography>
																	<VttMenu />
																</Toolbar>
															</AppBar>
															<VTTEditor />
															<ExtractFromVideoDialogs />
														</ExtractFromVideoProvider>
													</Paper>
													<div className={classes.player}>
														<Player />
													</div>
												</main>
												<Footer />
											</div>
										</CuesFromFileProvider>
									</CuesProvider>
								</KeyboardControlProvider>
							</VideoControlProvider>
						</DurationProvider>
					</PlayTimeProvider>
				</VideoDomProvider>
			</VideoFileProvider>
		</React.Fragment>
	)
}
