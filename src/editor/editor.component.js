import React from 'react'
import {AppBar, Hidden, Toolbar, Typography} from '@material-ui/core'
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
import {TranslationDialogs, TranslationProvider} from './TranslateButton'
import VttMenu from './vtt-menu.component'

const useStyles = makeStyles(theme => ({
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
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
		},
	},
	drawer: {
		display: 'flex',
		flexDirection: 'column',
		zIndex: 1,
		[theme.breakpoints.up('sm')]: {
			width: 400,
			height: '100%',
		},
		[theme.breakpoints.down('sm')]: {
			flex: 1,
			width: '100%',
		},
	},
	player: {
		minHeight: 0,
		minWidth: 0,
		[theme.breakpoints.up('sm')]: {
			flex: 1,
		},
		[theme.breakpoints.down('sm')]: {
			height: 350,
		},
	},
}))

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
											<ExtractFromVideoProvider>
												<TranslationProvider>
													<div className={classes.root}>
														<main className={classes.main}>
															<Hidden smUp>
																<AppBar position="static" color="primary">
																	<Toolbar>
																		<VCIcon fontSize="large" edge="start" style={{marginRight: 8}} />
																		<Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
																			VTT Creator
																		</Typography>
																		<VttMenu />
																	</Toolbar>
																</AppBar>
															</Hidden>
															<div className={classes.player}>
																<Player />
															</div>
															<div className={classes.drawer}>
																<Hidden smDown>
																	<AppBar position="static" color="primary">
																		<Toolbar>
																			<VCIcon fontSize="large" edge="start" style={{marginRight: 8}} />
																			<Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
																				VTT Creator
																			</Typography>
																			<VttMenu />
																		</Toolbar>
																	</AppBar>
																</Hidden>
																<VTTEditor />
															</div>
														</main>
														<Footer />
													</div>
													<ExtractFromVideoDialogs />
													<TranslationDialogs />
												</TranslationProvider>
											</ExtractFromVideoProvider>
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
