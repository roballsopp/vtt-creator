import {gql} from '@apollo/client'

export const BatchJobActionMenu_batchJobFragment = gql`
	fragment BatchJobActionMenu_batchJob on BatchJob {
		id
		downloadAvailable
		downloadLink
		createdAt
	}
`

export const BatchJobHistoryTable_batchJobsFragment = gql`
	fragment BatchJobHistoryTable_batchJobs on BatchJob {
		id
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
