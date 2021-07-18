import React from 'react'
import {gql, useQuery} from '@apollo/client'
import TablePagination from '@material-ui/core/TablePagination'
import JobHistoryTable from './JobHistoryTable'
import {handleError} from '../services/error-handler.service'

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

	const {data, previousData} = useQuery(
		gql`
			query JobHistoryTableGetJobs($offset: Int!, $limit: Int!) {
				transcriptionJobs {
					nodes(offset: $offset, limit: $limit) {
						...JobHistoryTable_jobs
					}
					totalCount
				}
			}
			${JobHistoryTable.fragments.jobs}
		`,
		{
			variables: {
				offset: page * pageSize,
				limit: pageSize,
			},
			onError: err => handleError(err),
		}
	)

	const jobConn = data?.transcriptionJobs || previousData?.transcriptionJobs
	const jobs = React.useMemo(() => jobConn?.nodes || [], [jobConn])
	const totalCount = React.useMemo(() => jobConn?.totalCount || 0, [jobConn])

	return (
		<React.Fragment>
			<JobHistoryTable jobs={jobs} />
			<TablePagination
				component="div"
				count={totalCount}
				rowsPerPage={pageSize}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</React.Fragment>
	)
}
