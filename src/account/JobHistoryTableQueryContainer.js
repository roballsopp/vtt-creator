import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, LinearProgress, TablePagination} from '@material-ui/core'
import JobHistoryTable from './JobHistoryTable'
import {handleError} from '../services/error-handler.service'
import {JobHistoryTableGetJobsQuery} from './JobHistoryTable.graphql'
import {useOffsetPagination, useSlicePage} from '../common/useOffsetPagination'

export default function JobHistoryTableQueryContainer() {
	const {offset, limit, paginatorProps} = useOffsetPagination(0, 10)

	const {data, previousData, loading} = useQuery(JobHistoryTableGetJobsQuery, {
		variables: {
			offset,
			limit,
		},
		onError: err => handleError(err),
	})

	const jobConn = data?.transcriptionJobs || previousData?.transcriptionJobs
	const jobs = useSlicePage(jobConn?.nodes, loading, offset, limit)
	const totalCount = jobConn?.totalCount || 0

	return (
		<Box position="relative">
			<JobHistoryTable jobs={jobs} />
			<TablePagination component="div" count={totalCount} {...paginatorProps} />
			{loading && (
				<Box position="absolute" bottom={0} left={0} right={0}>
					<LinearProgress />
				</Box>
			)}
		</Box>
	)
}
