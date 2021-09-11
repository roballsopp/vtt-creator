import React from 'react'
import {useQuery} from '@apollo/client'
import {Box, LinearProgress, TablePagination} from '@material-ui/core'
import TranslationHistoryTable from './TranslationHistoryTable'
import {handleError} from '../services/error-handler.service'
import {TranslationHistoryTableGetTranslationsQuery} from './TranslationHistoryTable.graphql'
import {useOffsetPagination, useSlicePage} from '../common/useOffsetPagination'

export default function TranslationHistoryTableQueryContainer() {
	const {offset, limit, paginatorProps} = useOffsetPagination(0, 10)

	const {data, previousData, loading} = useQuery(TranslationHistoryTableGetTranslationsQuery, {
		variables: {
			offset,
			limit,
		},
		onError: err => handleError(err),
	})

	const translationsConn = data?.translations || previousData?.translations
	const translations = useSlicePage(translationsConn?.nodes, loading, offset, limit)
	const totalCount = translationsConn?.totalCount || 0

	return (
		<Box position="relative">
			<TranslationHistoryTable translations={translations} />
			<TablePagination component="div" count={totalCount} {...paginatorProps} />
			{loading && (
				<Box position="absolute" bottom={0} left={0} right={0}>
					<LinearProgress />
				</Box>
			)}
		</Box>
	)
}
