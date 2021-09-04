import {gql} from '@apollo/client'

export const BatchJobActionMenu_batchJobFragment = gql`
	fragment BatchJobActionMenu_batchJob on BatchJob {
		id
		downloadAvailable
		downloadLinkVTT
		downloadLinkSRT
		createdAt
		startedAt
	}
`

export const BatchJobHistoryTable_batchJobsFragment = gql`
	fragment BatchJobHistoryTable_batchJobs on BatchJob {
		id
		name
		jobType
		createdAt
		startedAt
		finishedAt
		pendingCharges
		successfulCharges
		totalJobs
		startedJobs
		cancelledJobs
		failedJobs
		finishedJobs
		...BatchJobActionMenu_batchJob
	}
	${BatchJobActionMenu_batchJobFragment}
`

export const BatchJobHistoryTableGetBatchJobsQuery = gql`
	query BatchJobHistoryTableGetBatchJobs($offset: Int!, $limit: Int!) {
		batchJobs {
			nodes(offset: $offset, limit: $limit) {
				...BatchJobHistoryTable_batchJobs
			}
			totalCount
		}
	}
	${BatchJobHistoryTable_batchJobsFragment}
`

export function removeBatch(cache, batchId) {
	const data = cache.readQuery({
		query: BatchJobHistoryTableGetBatchJobsQuery,
		variables: {offset: 0, limit: 10},
	})

	if (data) {
		const nodes = data.batchJobs.nodes.filter(b => b.id !== batchId)
		cache.writeQuery({
			query: BatchJobHistoryTableGetBatchJobsQuery,
			data: {
				...data,
				batchJobs: {
					...data.batchJobs,
					nodes,
					totalCount: data.batchJobs.totalCount - 1,
				},
			},
		})
	}
}
