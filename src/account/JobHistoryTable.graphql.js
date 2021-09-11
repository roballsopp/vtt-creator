import {gql} from '@apollo/client'

export const JobActionMenu_jobFragment = gql`
	fragment JobActionMenu_job on TranscriptionJob {
		id
		downloadAvailable
		transcriptDownloadLinkRaw
		transcriptDownloadLinkVTT
		transcriptDownloadLinkSRT
		createdAt
	}
`

export const JobHistoryTable_jobsFragment = gql`
	fragment JobHistoryTable_jobs on TranscriptionJob {
		id
		cost
		fileDuration
		language
		state
		createdAt
		updatedAt
		...JobActionMenu_job
	}
	${JobActionMenu_jobFragment}
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
		variables: {offset: 0, limit: 10},
	})

	// its possible we have never visited the account page, in which case nothing will be in the cache here
	//   that should mean we don't need to update the cache, because a request will be made to get this the first time
	if (!jobHistoryQuery) return

	cache.writeQuery({
		query: JobHistoryTableGetJobsQuery,
		data: {
			...jobHistoryQuery,
			transcriptionJobs: {
				...jobHistoryQuery?.transcriptionJobs,
				nodes: [job, ...(jobHistoryQuery?.transcriptionJobs?.nodes || [])],
				totalCount: jobHistoryQuery.transcriptionJobs.totalCount + 1,
			},
		},
	})
}

export function removeJob(cache, jobId) {
	const data = cache.readQuery({
		query: JobHistoryTableGetJobsQuery,
		variables: {offset: 0, limit: 10},
	})

	// its possible we have never visited the account page, in which case nothing will be in the cache here
	if (!data) return

	cache.writeQuery({
		query: JobHistoryTableGetJobsQuery,
		data: {
			...data,
			transcriptionJobs: {
				...data.transcriptionJobs,
				nodes: data.transcriptionJobs.nodes.filter(j => j.id !== jobId),
				totalCount: data.transcriptionJobs.totalCount - 1,
			},
		},
	})
}
