import React from 'react'
import {useQuery} from '@apollo/client'
import download from 'downloadjs'
import {Box, Button, Grid, LinearProgress, TablePagination, Tooltip, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import muiGreys from '@material-ui/core/colors/grey'
import muiBlues from '@material-ui/core/colors/blue'
import muiYellows from '@material-ui/core/colors/yellow'
import muiReds from '@material-ui/core/colors/red'
import muiGreens from '@material-ui/core/colors/green'
import {handleError} from '../services/error-handler.service'
import {useOffsetPagination, useSlicePage} from '../common/useOffsetPagination'
import PageLoader from '../common/PageLoader'
import PageError from '../common/PageError'
import {BatchTranscriptionStatusTableGetJobsQuery} from './BatchTranscriptionStatusTable.graphql'
import BatchTranscriptionStatusTable from './BatchTranscriptionStatusTable'
import BatchStatusIndicator from '../common/BatchStatusIndicator'
import {cognitoUserPool} from '../cognito'
import {ApiURL} from '../config'

const useStyles = makeStyles(theme => ({
	titleBox: {
		backgroundColor: theme.palette.grey[200],
		padding: theme.spacing(2),
		borderRadius: 2,
	},
	valueBox: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.spacing(2, 4),
		borderRadius: 2,
		position: 'relative',
	},
	noWrapBox: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.spacing(2, 4),
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
}))

export default function BatchTranscriptionStatusTableContainer({batchId}) {
	const classes = useStyles()
	const {offset, limit, paginatorProps} = useOffsetPagination(0, 10)

	const handleDownloadTranscript = downloadPath => {
		const cognitoUser = cognitoUserPool.getCurrentUser()

		cognitoUser.getSession((err, session) => {
			if (err) {
				return console.error(err)
			}
			const token = session.getIdToken().getJwtToken()
			const url = new URL(downloadPath, ApiURL)
			download(`${url.href}?token=${token}`)
		})
	}

	const {data, previousData, error, loading, refetch} = useQuery(BatchTranscriptionStatusTableGetJobsQuery, {
		variables: {
			batchId,
			offset,
			limit,
		},
		pollInterval: 3000,
		onError: err => handleError(err),
	})

	const jobConn = data?.transcriptionJobs || previousData?.transcriptionJobs
	const jobs = useSlicePage(jobConn?.nodes, loading, offset, limit)
	const totalCount = jobConn?.totalCount || 0

	if (loading) {
		return <PageLoader />
	}

	if (error) {
		return <PageError retry={refetch} />
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h6" align="center">
					Batch Status
				</Typography>
			</Grid>
			<Grid item container direction="column" xs={12} sm={3}>
				<div className={classes.titleBox}>
					<Typography variant="subtitle1" align="center">
						Batch Name:
					</Typography>
				</div>
				<div className={classes.valueBox}>
					<div className={classes.noWrapBox}>
						<Tooltip title={data.batchJob.name}>
							<Typography variant="body1" align="center" noWrap>
								{data.batchJob.name}
							</Typography>
						</Tooltip>
					</div>
				</div>
			</Grid>
			<Grid item container direction="column" justifyContent="center" xs={12} sm={3}>
				<div className={classes.titleBox}>
					<Typography variant="subtitle1" align="center">
						Batch Status:
					</Typography>
				</div>
				<div className={classes.valueBox}>
					<Typography variant="body1" align="center">
						<BatchStatusIndicator batchJob={data.batchJob} />
					</Typography>
				</div>
			</Grid>
			<Grid item container direction="column" justifyContent="center" xs={12} sm={3}>
				<div className={classes.titleBox}>
					<Typography variant="subtitle1" align="center">
						Batch Cost:
					</Typography>
				</div>
				<div className={classes.valueBox}>
					<Typography variant="body1" align="center">
						${data.batchJob.totalCost.toFixed(2)}
					</Typography>
				</div>
			</Grid>
			<Grid item container direction="column" xs={12} sm={3}>
				<div className={classes.titleBox}>
					<Typography variant="subtitle1" align="center">
						Downloads:
					</Typography>
				</div>
				{data.batchJob.downloadAvailable && (
					<div className={classes.valueBox}>
						<Button color="primary" onClick={() => handleDownloadTranscript(data.batchJob.downloadLink)}>
							Download cues
						</Button>
					</div>
				)}
				{!data.batchJob.downloadAvailable && (
					<div className={classes.valueBox}>
						<Typography variant="body1" align="center">
							-
						</Typography>
					</div>
				)}
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h6" align="center">
					Transcription Jobs In This Batch
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Box display="flex" bgcolor={muiGreys[200]} borderRadius={2}>
					<Box flex={1} color={muiBlues[800]} p={2}>
						<Typography color="inherit" align="center" variant="subtitle1">
							Total Jobs: {data.batchJob.totalJobs}
						</Typography>
					</Box>
					<Box flex={1} color={muiYellows[800]} p={2}>
						<Typography color="inherit" align="center" variant="subtitle1">
							Started: {data.batchJob.startedJobs}
						</Typography>
					</Box>
					<Box flex={1} color={muiGreys[500]} p={2}>
						<Typography color="inherit" align="center" variant="subtitle1">
							Cancelled: {data.batchJob.cancelledJobs}
						</Typography>
					</Box>
					<Box flex={1} color={muiReds[800]} p={2}>
						<Typography color="inherit" align="center" variant="subtitle1">
							Failed: {data.batchJob.failedJobs}
						</Typography>
					</Box>
					<Box flex={1} color={muiGreens[800]} p={2}>
						<Typography color="inherit" align="center" variant="subtitle1">
							Succeeded: {data.batchJob.finishedJobs}
						</Typography>
					</Box>
				</Box>
				<Box position="relative">
					<BatchTranscriptionStatusTable jobs={jobs} />
					<TablePagination component="div" count={totalCount} {...paginatorProps} />
					{loading && (
						<Box position="absolute" bottom={0} left={0} right={0}>
							<LinearProgress />
						</Box>
					)}
				</Box>
			</Grid>
		</Grid>
	)
}
