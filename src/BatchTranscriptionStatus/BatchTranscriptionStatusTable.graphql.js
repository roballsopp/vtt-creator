import {gql} from '@apollo/client'

export const BatchStatus_batchFragment = gql`
	fragment BatchStatus_batch on BatchJob {
		id
		name
		downloadAvailable
		downloadLinkVTT
		downloadLinkSRT
		createdAt
		startedAt
		finishedAt
		totalCost
		totalJobs
		startedJobs
		cancelledJobs
		failedJobs
		finishedJobs
	}
`

export const BatchTranscriptionStatusTable_jobsFragment = gql`
	fragment BatchTranscriptionStatusTable_jobs on TranscriptionJob {
		id
		cost
		fileDuration
		language
		state
		createdAt
		updatedAt
	}
`

export const BatchTranscriptionStatusTableGetJobsQuery = gql`
	query BatchTranscriptionStatusTableGetJobs($batchId: String!, $offset: Int!, $limit: Int!) {
		batchJob(batchId: $batchId) {
			...BatchStatus_batch
		}
		transcriptionJobs(batchId: $batchId) {
			nodes(offset: $offset, limit: $limit) {
				...BatchTranscriptionStatusTable_jobs
			}
			totalCount
		}
	}
	${BatchStatus_batchFragment}
	${BatchTranscriptionStatusTable_jobsFragment}
`
