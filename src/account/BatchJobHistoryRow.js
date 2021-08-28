import * as React from 'react'
import PropTypes from 'prop-types'
import {format} from 'date-fns'
import {
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import muiReds from '@material-ui/core/colors/red'
import muiGreens from '@material-ui/core/colors/green'
import muiYellows from '@material-ui/core/colors/yellow'
import muiBlues from '@material-ui/core/colors/blue'
import muiGreys from '@material-ui/core/colors/grey'
import CaptionsIcon from '@material-ui/icons/ClosedCaption'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import TranslateIcon from '@material-ui/icons/Translate'
import BatchJobActionMenu from './BatchJobActionMenu'

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
	detailRow: {
		boxShadow: `inset 0 3px 3px -2px rgba(0,0,0,0.2)`,
		overflow: 'hidden',
		backgroundColor: muiGreys[100],
	},
	collapseIcon: {
		margin: -12,
	},
}))

BatchJobHistoryRow.propTypes = {
	batchJob: PropTypes.shape({
		id: PropTypes.string.isRequired,
		jobType: PropTypes.oneOf(['transcription', 'translation']).isRequired,
		createdAt: PropTypes.string.isRequired,
		startedAt: PropTypes.string,
		finishedAt: PropTypes.string,
		pendingCharges: PropTypes.number.isRequired,
		successfulCharges: PropTypes.number.isRequired,
		totalJobs: PropTypes.number.isRequired,
		startedJobs: PropTypes.number.isRequired,
		cancelledJobs: PropTypes.number.isRequired,
		failedJobs: PropTypes.number.isRequired,
		finishedJobs: PropTypes.number.isRequired,
	}).isRequired,
}

export default function BatchJobHistoryRow({batchJob}) {
	const classes = useStyles()

	const [showProgress, setShowProgress] = React.useState(false)

	function getStatusText(batchJob) {
		if (batchJob.finishedAt) {
			return (
				<Tooltip title={`Finished on ${format(new Date(batchJob.finishedAt), 'LLL dd, yyyy h:mm aaa')}`}>
					<span>Finished</span>
				</Tooltip>
			)
		}

		if (batchJob.startedAt) {
			return (
				<Tooltip title={`Started on ${format(new Date(batchJob.startedAt), 'LLL dd, yyyy h:mm aaa')}`}>
					<span>Started</span>
				</Tooltip>
			)
		}

		return (
			<Tooltip title={`Created on ${format(new Date(batchJob.createdAt), 'LLL dd, yyyy h:mm aaa')}`}>
				<span>Not Started</span>
			</Tooltip>
		)
	}

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell padding="none" align="center">
					<Tooltip title="Click to show details">
						<IconButton
							aria-label="expand row"
							onClick={() => setShowProgress(p => !p)}
							className={classes.collapseIcon}>
							{showProgress ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</Tooltip>
				</TableCell>
				<TableCell>{getStatusText(batchJob)}</TableCell>
				<TableCell align="center" padding="none">
					<Box display="flex" alignItems="center" justifyContent="center">
						<JobTypeIcon type={batchJob.jobType} />
					</Box>
				</TableCell>
				<TableCell align="right">${batchJob.pendingCharges.toFixed(2)}</TableCell>
				<TableCell align="right">${batchJob.successfulCharges.toFixed(2)}</TableCell>
				<TableCell align="center" padding="none">
					<BatchJobActionMenu batchJob={batchJob} />
				</TableCell>
			</TableRow>
			<TableRow className={classes.detailRow}>
				<TableCell style={{padding: 0}} colSpan={6}>
					<Collapse in={showProgress} timeout="auto" unmountOnExit>
						<Box display="flex">
							<Box flex={1} color={muiBlues[800]} p={2}>
								<Typography color="inherit" align="center" variant="subtitle2">
									Total Jobs: {batchJob.totalJobs}
								</Typography>
							</Box>
							<Box flex={1} color={muiYellows[800]} p={2}>
								<Typography color="inherit" align="center" variant="subtitle2">
									Started: {batchJob.startedJobs}
								</Typography>
							</Box>
							<Box flex={1} color={muiGreys[500]} p={2}>
								<Typography color="inherit" align="center" variant="subtitle2">
									Cancelled: {batchJob.cancelledJobs}
								</Typography>
							</Box>
							<Box flex={1} color={muiReds[800]} p={2}>
								<Typography color="inherit" align="center" variant="subtitle2">
									Failed: {batchJob.failedJobs}
								</Typography>
							</Box>
							<Box flex={1} color={muiGreens[800]} p={2}>
								<Typography color="inherit" align="center" variant="subtitle2">
									Succeeded: {batchJob.finishedJobs}
								</Typography>
							</Box>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

function JobTypeIcon({type}) {
	if (type === 'transcription') {
		return (
			<Tooltip title="The batch contains caption transcriptions">
				<CaptionsIcon />
			</Tooltip>
		)
	}

	if (type === 'translation') {
		return (
			<Tooltip title="The batch contains caption translations">
				<TranslateIcon />
			</Tooltip>
		)
	}

	return null
}
