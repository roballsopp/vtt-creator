import * as React from 'react'
import Divider from '@material-ui/core/Divider'
import FabButton from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import {makeStyles} from '@material-ui/styles'
import {List, Loader, useCues} from '../common'
import CueEditor from './cue-editor.component'
import {AutoScrollProvider} from './auto-scroll.context'
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
					<List
						className={classes.list}
						data={cues}
						getKey={cue => cue.id}
						renderItem={(cue, i, isLast) => (
							<React.Fragment key={cue.id}>
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
								{!isLast && <Divider />}
							</React.Fragment>
						)}
					/>
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
