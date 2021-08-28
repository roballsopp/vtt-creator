import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, LinearProgress, TablePagination} from '@material-ui/core'
import BatchJobHistoryTable from './BatchJobHistoryTable'
import {handleError} from '../services/error-handler.service'
import {BatchJobHistoryTableGetBatchJobsQuery} from './BatchJobHistoryTable.graphql'

export default function BatchJobHistoryTableQueryContainer() {
	const [pageSize, setPageSize] = React.useState(10)
	const [page, setPage] = React.useState(0)

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = e => {
		setPageSize(Number(e.target.value))
		setPage(0)
	}

	const {loading, data, previousData} = useQuery(BatchJobHistoryTableGetBatchJobsQuery, {
		variables: {
			offset: page * pageSize,
			limit: pageSize,
		},
		onError: err => handleError(err),
	})

	const batchJobsConn = data?.batchJobs || previousData?.batchJobs
	const batchJobs = React.useMemo(() => batchJobsConn?.nodes || [], [batchJobsConn])
	const totalCount = React.useMemo(() => batchJobsConn?.totalCount || 0, [batchJobsConn])

	return (
		<Box position="relative">
			<BatchJobHistoryTable batchJobs={batchJobs} />
			<TablePagination
				component="div"
				count={totalCount}
				rowsPerPage={pageSize}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
			{loading && (
				<Box position="absolute" bottom={0} left={0} right={0}>
					<LinearProgress />
				</Box>
			)}
		</Box>
	)
}
