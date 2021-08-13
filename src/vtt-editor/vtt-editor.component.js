import * as React from 'react'
import FlipMove from 'react-flip-move'
import {Divider, Fab as FabButton, Tooltip} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {makeStyles} from '@material-ui/styles'
import {Loader, useCues} from '../common'
import CueEditor from './cue-editor.component'
import {AutoScrollProvider, useAutoScroll} from './auto-scroll.context'
import AutoScrollItem from './auto-scroll-item.component'
import EmptyState from './EmptyState'

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative',
		flex: 1,
	},
	list: {
		marginTop: theme.spacing(1),
		marginBottom: 90,
	},
	cueEditor: {
		padding: 10,
	},
	fab: {
		position: 'absolute',
		bottom: theme.spacing(4),
		right: theme.spacing(4),
	},
}))

VTTEditor.propTypes = {}

export default function VTTEditor() {
	const classes = useStyles()
	const {cues, loading, addCue, removeCue, changeCueEnd, changeCueStart, changeCueText, changeCueTiming} = useCues()

	return (
		<div className={classes.root}>
			{!loading && !cues.length ? <EmptyState /> : null}
			{!loading && cues.length ? (
				<AutoScrollProvider>
					<ListAnimation className={classes.list}>
						{cues.map(cue => (
							<div key={cue.id}>
								<AutoScrollItem cueTime={cue.startTime} className={classes.cueEditor}>
									<CueEditor
										cue={cue}
										onRemoveCue={removeCue}
										onChangeCueEnd={changeCueEnd}
										onChangeCueStart={changeCueStart}
										onChangeCueText={changeCueText}
										onChangeCueTiming={changeCueTiming}
									/>
								</AutoScrollItem>
								<Divider />
							</div>
						))}
					</ListAnimation>
				</AutoScrollProvider>
			) : null}
			{loading ? <Loader /> : null}
			<Tooltip title="Add Cue" placement="top">
				<FabButton className={classes.fab} color="secondary" aria-label="Add Cue" onClick={addCue}>
					<AddIcon />
				</FabButton>
			</Tooltip>
		</div>
	)
}

function ListAnimation({children, className}) {
	const {scrollToChild} = useAutoScroll()

	function moveToItemOnEnter(element, domNode) {
		if (element.entering) {
			scrollToChild(domNode)
		}
	}

	return (
		<FlipMove
			className={className}
			onStart={moveToItemOnEnter}
			enterAnimation="accordionVertical"
			leaveAnimation="accordionVertical">
			{children}
		</FlipMove>
	)
}
