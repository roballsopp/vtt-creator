import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, LinearProgress, TablePagination} from '@material-ui/core'
import TranslationHistoryTable from './TranslationHistoryTable'
import {handleError} from '../services/error-handler.service'
import {TranslationHistoryTableGetTranslationsQuery} from './TranslationHistoryTable.graphql'

export default function TranslationHistoryTableQueryContainer() {
	const [pageSize, setPageSize] = React.useState(10)
	const [page, setPage] = React.useState(0)

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = e => {
		setPageSize(Number(e.target.value))
		setPage(0)
	}

	const {loading, data, previousData} = useQuery(TranslationHistoryTableGetTranslationsQuery, {
		variables: {
			offset: page * pageSize,
			limit: pageSize,
		},
		onError: err => handleError(err),
	})

	const translationsConn = data?.translations || previousData?.translations
	const translations = React.useMemo(() => translationsConn?.nodes || [], [translationsConn])
	const totalCount = React.useMemo(() => translationsConn?.totalCount || 0, [translationsConn])

	return (
		<Box position="relative">
			<TranslationHistoryTable translations={translations} />
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
