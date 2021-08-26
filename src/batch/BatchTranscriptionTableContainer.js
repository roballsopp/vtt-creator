import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, CircularProgress, LinearProgress, TablePagination} from '@material-ui/core'
import BatchTranscriptionTable from './BatchTranscriptionTable'
import {handleError} from '../services/error-handler.service'
import {BatchTranscriptionTableGetJobsQuery} from './BatchTranscriptionTable.graphql'

export default function BatchTranscriptionTableContainer({batchId}) {
	const [pageSize, setPageSize] = React.useState(10)
	const [page, setPage] = React.useState(0)

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = e => {
		setPageSize(Number(e.target.value))
		setPage(0)
	}

	const {loading, data, previousData} = useQuery(BatchTranscriptionTableGetJobsQuery, {
		// TODO: wtf
		fetchPolicy: 'network-only',
		variables: {
			batchId,
			offset: page * pageSize,
			limit: pageSize,
		},
		onError: err => handleError(err),
	})

	const transcriptionJobsConn = data?.transcriptionJobs || previousData?.transcriptionJobs
	const transcriptionJobs = React.useMemo(() => transcriptionJobsConn?.nodes || [], [transcriptionJobsConn])
	const totalCount = React.useMemo(() => transcriptionJobsConn?.totalCount || 0, [transcriptionJobsConn])

	// TODO: use the cool react placeholder lib
	if (!transcriptionJobsConn) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height={400}>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Box position="relative">
			<BatchTranscriptionTable batchId={batchId} jobs={transcriptionJobs} totals={transcriptionJobsConn.aggregate} />
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
