import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, LinearProgress, TablePagination} from '@material-ui/core'
import JobHistoryTable from './JobHistoryTable'
import {handleError} from '../services/error-handler.service'
import {JobHistoryTableGetJobsQuery} from './JobHistoryTable.graphql'

export default function JobHistoryTableQueryContainer() {
	const [pageSize, setPageSize] = React.useState(10)
	const [page, setPage] = React.useState(0)

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = e => {
		setPageSize(Number(e.target.value))
		setPage(0)
	}

	const {loading, data, previousData} = useQuery(JobHistoryTableGetJobsQuery, {
		variables: {
			offset: page * pageSize,
			limit: pageSize,
		},
		onError: err => handleError(err),
	})

	const jobConn = data?.transcriptionJobs || previousData?.transcriptionJobs
	const jobs = React.useMemo(() => jobConn?.nodes || [], [jobConn])
	const totalCount = React.useMemo(() => jobConn?.totalCount || 0, [jobConn])

	return (
		<Box position="relative">
			<JobHistoryTable jobs={jobs} />
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
