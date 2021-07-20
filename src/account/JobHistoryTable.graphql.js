import {gql} from '@apollo/client'

export const JobHistoryTable_jobsFragment = gql`
	fragment JobHistoryTable_jobs on TranscriptionJob {
		id
		cost
		fileDuration
		language
		state
		createdAt
	}
`

export const JobHistoryTableGetJobsQuery = gql`
	query JobHistoryTableGetJobs($offset: Int!, $limit: Int!) {
		transcriptionJobs {
			nodes(offset: $offset, limit: $limit) {
				...JobHistoryTable_jobs
			}
			totalCount
		}
	}
	${JobHistoryTable_jobsFragment}
`

export function appendNewJob(cache, job) {
	const jobHistoryQuery = cache.readQuery({
		query: JobHistoryTableGetJobsQuery,
	})

	if (jobHistoryQuery) {
		const nodes = [job, ...(jobHistoryQuery?.transcriptionJobs?.nodes || [])]
		cache.writeQuery({
			query: JobHistoryTableGetJobsQuery,
			data: {
				...jobHistoryQuery,
				transcriptionJobs: {
					...jobHistoryQuery?.transcriptionJobs,
					nodes,
				},
			},
		})
	}
}
