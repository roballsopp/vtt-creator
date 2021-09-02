import {gql} from '@apollo/client'

export const BatchTranscriptionCart_jobsFragment = gql`
	fragment BatchTranscriptionCart_jobs on TranscriptionJob {
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

export const BatchTranscriptionCart_totalsFragment = gql`
	fragment BatchTranscriptionCart_totals on TranscriptionJobsAggregation {
		totalCost
		totalDuration
	}
`

export const BatchTranscriptionCartGetJobsQuery = gql`
	query BatchTranscriptionCartGetJobs($batchId: String!, $offset: Int!, $limit: Int!) {
		transcriptionJobs(batchId: $batchId) {
			nodes(offset: $offset, limit: $limit) {
				...BatchTranscriptionCart_jobs
			}
			totalCount
			aggregate {
				...BatchTranscriptionCart_totals
			}
		}
	}
	${BatchTranscriptionCart_jobsFragment}
	${BatchTranscriptionCart_totalsFragment}
`

export function appendJobToBatch(cache, batchId, job) {
	const data = cache.readQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		variables: {batchId, offset: 0, limit: 10},
	})

	if (data) {
		const nodes = [job, ...(data.transcriptionJobs?.nodes || [])]
		cache.writeQuery({
			query: BatchTranscriptionCartGetJobsQuery,
			variables: {batchId, offset: 0, limit: 10},
			data: {
				...data,
				transcriptionJobs: {
					...data.transcriptionJobs,
					nodes,
					aggregate: {
						...data.transcriptionJobs.aggregate,
						totalCost: data.transcriptionJobs.aggregate.totalCost + job.cost,
					},
					totalCount: data.transcriptionJobs.totalCount + 1,
				},
			},
		})
	} else {
		// if there was no data, we are probably on a new blank page and there was no data to load
		cache.writeQuery({
			query: BatchTranscriptionCartGetJobsQuery,
			variables: {batchId, offset: 0, limit: 10},
			data: {
				transcriptionJobs: {
					nodes: [job],
					aggregate: {
						totalCost: job.cost,
					},
					totalCount: 1,
				},
			},
		})
	}
}

export function updateBatchLanguage(cache, batchId, newLanguage) {
	const data = cache.readQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		variables: {batchId, offset: 0, limit: 100000},
	})

	if (data) {
		cache.writeQuery({
			query: BatchTranscriptionCartGetJobsQuery,
			data: {
				...data,
				transcriptionJobs: {
					...data.transcriptionJobs,
					nodes: data.transcriptionJobs.nodes.map(n => ({...n, language: newLanguage})),
				},
			},
		})
	}
}
