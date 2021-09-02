import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, LinearProgress, TablePagination} from '@material-ui/core'
import BatchJobHistoryTable from './BatchJobHistoryTable'
import {handleError} from '../services/error-handler.service'
import {BatchJobHistoryTableGetBatchJobsQuery} from './BatchJobHistoryTable.graphql'
import {useOffsetPagination, useSlicePage} from '../common/useOffsetPagination'

export default function BatchJobHistoryTableQueryContainer() {
	const {offset, limit, paginatorProps} = useOffsetPagination(0, 10)

	const {data, previousData, loading} = useQuery(BatchJobHistoryTableGetBatchJobsQuery, {
		variables: {
			offset,
			limit,
		},
		onError: err => handleError(err),
	})

	const batchJobsConn = data?.batchJobs || previousData?.batchJobs
	const batchJobs = useSlicePage(batchJobsConn?.nodes, loading, offset, limit)
	const totalCount = batchJobsConn?.totalCount || 0

	return (
		<Box position="relative">
			<BatchJobHistoryTable batchJobs={batchJobs} />
			<TablePagination component="div" count={totalCount} {...paginatorProps} />
			{loading && (
				<Box position="absolute" bottom={0} left={0} right={0}>
					<LinearProgress />
				</Box>
			)}
		</Box>
	)
}
