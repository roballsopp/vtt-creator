import React from 'react'
import {Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {CuesProvider, CuesFromFileProvider, VideoFileProvider} from '../common'
import {
	DurationProvider,
	PlayTimeProvider,
	VideoDomProvider,
	KeyboardControlProvider,
	VideoControlProvider,
} from '../common/video'
import Player from '../player'
import VTTEditor from '../vtt-editor'
import {ExtractFromVideoProvider} from './CueExtractionButton'
import {TranslationProvider} from './TranslateButton'
import VTTToolbar from './VTTToolbar'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minHeight: 0,
		minWidth: 0,
		overflow: 'hidden',
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
														<div className={classes.player}>
															<Player />
														</div>
														<div className={classes.drawer}>
															<Hidden smDown>
																<VTTToolbar />
															</Hidden>
															<VTTEditor />
														</div>
													</main>
												</div>
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
	)
}
