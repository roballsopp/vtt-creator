import {gql} from '@apollo/client'

export const TranslationActionMenu_translationFragment = gql`
	fragment TranslationActionMenu_translation on Translation {
		id
		downloadAvailable
		translationDownloadLinkRaw
		translationDownloadLinkVTT
		translationDownloadLinkSRT
		createdAt
	}
`

export const TranslationHistoryTable_translationsFragment = gql`
	fragment TranslationHistoryTable_translations on Translation {
		id
		cost
		numCharacters
		sourceLang
		targetLang
		state
		createdAt
		updatedAt
		...TranslationActionMenu_translation
	}
	${TranslationActionMenu_translationFragment}
`

export const TranslationHistoryTableGetTranslationsQuery = gql`
	query TranslationHistoryTableGetTranslations($offset: Int!, $limit: Int!) {
		translations {
			nodes(offset: $offset, limit: $limit) {
				...TranslationHistoryTable_translations
			}
			totalCount
		}
	}
	${TranslationHistoryTable_translationsFragment}
`

export function appendNewTranslation(cache, job) {
	const jobHistoryQuery = cache.readQuery({
		query: TranslationHistoryTableGetTranslationsQuery,
	})

	if (jobHistoryQuery) {
		const nodes = [job, ...(jobHistoryQuery?.transcriptionTranslations?.nodes || [])]
		cache.writeQuery({
			query: TranslationHistoryTableGetTranslationsQuery,
			data: {
				...jobHistoryQuery,
				transcriptionTranslations: {
					...jobHistoryQuery?.transcriptionTranslations,
					nodes,
				},
			},
		})
	}
}
