import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, LinearProgress, TablePagination} from '@material-ui/core'
import TranslationHistoryTable from './TranslationHistoryTable'
import {handleError} from '../services/error-handler.service'
import {TranslationHistoryTableGetTranslationsQuery} from './TranslationHistoryTable.graphql'

export default function TranslationHistoryTableQueryContainer() {
	const [pageSize, setPageSize] = React.useState(10)
	const [page, setPage] = React.useState(0)
	const [translationsConn, setTranslationsConn] = React.useState({})

	const offset = page * pageSize

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = e => {
		setPageSize(Number(e.target.value))
		setPage(0)
	}

	const {loading} = useQuery(TranslationHistoryTableGetTranslationsQuery, {
		variables: {
			offset,
			limit: pageSize,
		},
		onError: err => handleError(err),
		onCompleted: ({translations}) => {
			setTranslationsConn({
				...translations,
				nodes: translations.nodes.slice(offset, offset + pageSize),
			})
		},
	})

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
