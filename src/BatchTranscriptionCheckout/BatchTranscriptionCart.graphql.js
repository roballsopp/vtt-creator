import {gql} from '@apollo/client'

export const BatchTranscriptionCartItem_jobFragment = gql`
	fragment BatchTranscriptionCartItem_job on TranscriptionJob {
		id
		batchId
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
		...BatchTranscriptionCartItem_job
	}
	${BatchTranscriptionCartItem_jobFragment}
`

export const BatchTranscriptionCartSummary_batchFragment = gql`
	fragment BatchTranscriptionCartSummary_batch on BatchJob {
		id
		name
		jobs {
			totalCost
			totalCount
		}
	}
`

export const BatchTranscriptionCartGetJobsQuery = gql`
	query BatchTranscriptionCartGetJobs($batchId: String!, $offset: Int!, $limit: Int!) {
		batchJob(batchId: $batchId) {
			id
			jobs {
				nodes(offset: $offset, limit: $limit) {
					...BatchTranscriptionCart_jobs
				}
				totalCount
			}
			...BatchTranscriptionCartSummary_batch
		}
	}
	${BatchTranscriptionCart_jobsFragment}
	${BatchTranscriptionCartSummary_batchFragment}
`

export function appendJobToBatch(cache, batchId, job) {
	const data = cache.readQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		variables: {batchId, offset: 0, limit: 10},
	})

	cache.writeQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		variables: {batchId, offset: 0, limit: 10},
		data: {
			...data,
			batchJob: {
				...data.batchJob,
				jobs: {
					...data.batchJob.jobs,
					nodes: [job, ...(data.batchJob.jobs.nodes || [])],
					totalCost: data.batchJob.jobs.totalCost + job.cost,
					totalCount: data.batchJob.jobs.totalCount + 1,
				},
			},
		},
	})
}

export function updateBatchLanguage(cache, batchId, newLanguage) {
	const data = cache.readQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		variables: {batchId, offset: 0, limit: 10},
	})

	cache.writeQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		data: {
			...data,
			batchJob: {
				...data.batchJob,
				jobs: {
					...data.batchJob.jobs,
					nodes: data.batchJob.jobs.nodes.map(n => ({...n, language: newLanguage})),
				},
			},
		},
	})
}

export function removeJobFromBatch(cache, batchId, job) {
	const data = cache.readQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		variables: {batchId, offset: 0, limit: 10},
	})

	cache.writeQuery({
		query: BatchTranscriptionCartGetJobsQuery,
		variables: {batchId, offset: 0, limit: 10},
		data: {
			...data,
			batchJob: {
				...data.batchJob,
				jobs: {
					...data.batchJob.jobs,
					nodes: data.batchJob.jobs.nodes.filter(j => j.id !== job.id),
					totalCost: data.batchJob.jobs.totalCost - job.cost,
					totalCount: data.batchJob.jobs.totalCount - 1,
				},
			},
		},
	})
}
