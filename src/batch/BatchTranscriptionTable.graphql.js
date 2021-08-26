import {gql} from '@apollo/client'

export const BatchTranscriptionTable_jobsFragment = gql`
	fragment BatchTranscriptionTable_jobs on TranscriptionJob {
		id
		cost
		pricePerMin
		fileDuration
		language
		state
		createdAt
		inputFile {
			id
			originalFileName
		}
	}
`

export const BatchTranscriptionTable_totalsFragment = gql`
	fragment BatchTranscriptionTable_totals on TranscriptionJobsAggregation {
		totalCost
		totalDuration
	}
`

export const BatchTranscriptionTableGetJobsQuery = gql`
	query BatchTranscriptionTableGetJobs($batchId: String!, $offset: Int!, $limit: Int!) {
		transcriptionJobs(batchId: $batchId) {
			nodes(offset: $offset, limit: $limit) {
				...BatchTranscriptionTable_jobs
			}
			totalCount
			aggregate {
				...BatchTranscriptionTable_totals
			}
		}
	}
	${BatchTranscriptionTable_jobsFragment}
	${BatchTranscriptionTable_totalsFragment}
`
