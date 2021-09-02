import React from 'react'
import {useQuery} from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import {Box, CircularProgress, Grid, LinearProgress, Paper} from '@material-ui/core'
import BatchTranscriptionCart from './BatchTranscriptionCart'
import {handleError} from '../services/error-handler.service'
import {BatchTranscriptionCartGetJobsQuery} from './BatchTranscriptionCart.graphql'
import {usePage} from '../common/PageContainer'
import BatchTranscriptionCartSummary from './BatchTranscriptionCartSummary'

export default function BatchTranscriptionCartContainer({batchId}) {
	const {pageContainerRef} = usePage()

	const {loading, data, previousData, fetchMore} = useQuery(BatchTranscriptionCartGetJobsQuery, {
		// TODO: this is seemingly necessary when there are no jobs yet
		fetchPolicy: 'network-only',
		variables: {
			batchId,
			offset: 0,
			limit: 10,
		},
		onError: err => handleError(err),
	})

	const transcriptionJobsConn = data?.transcriptionJobs || previousData?.transcriptionJobs
	const transcriptionJobs = React.useMemo(() => transcriptionJobsConn?.nodes || [], [transcriptionJobsConn])
	const totalCount = React.useMemo(() => transcriptionJobsConn?.totalCount || 0, [transcriptionJobsConn])

	function handleLoadMore() {
		fetchMore({variables: {offset: transcriptionJobs.length}})
	}

	// TODO: use the cool react placeholder lib
	if (!transcriptionJobsConn) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height={400}>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={7}>
				<Paper>
					<Box position="relative">
						<InfiniteScroll
							dataLength={transcriptionJobs.length || 0}
							next={handleLoadMore}
							hasMore={totalCount > transcriptionJobs.length}
							loader={
								// the key={0} is silly but actually necessary https://github.com/danbovey/react-infinite-scroller/issues/151#issuecomment-383414225
								<Box
									key={0}
									display="flex"
									alignItems="center"
									justifyContent="center"
									height={30}
									p={1}
									mt={2}
									overflow="hidden">
									<CircularProgress size={24} />
								</Box>
							}
							scrollableTarget={pageContainerRef.current}>
							<BatchTranscriptionCart batchId={batchId} jobs={transcriptionJobs} />
						</InfiniteScroll>
						{loading && (
							<Box position="absolute" bottom={0} left={0} right={0}>
								<LinearProgress />
							</Box>
						)}
					</Box>
				</Paper>
			</Grid>
			<Grid item xs={12} md={5}>
				<Paper style={{position: 'sticky', top: 16}}>
					<BatchTranscriptionCartSummary
						batchId={batchId}
						totalCost={transcriptionJobsConn.aggregate.totalCost}
						batchHasJobs={Boolean(transcriptionJobs.length)}
					/>
				</Paper>
			</Grid>
		</Grid>
	)
}
