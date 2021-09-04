import * as React from 'react'
import {useParams} from 'react-router-dom'
import PageContainer from '../common/PageContainer'
import BatchTranscriptionStatusTable from './BatchTranscriptionStatusTableContainer'

export default function BatchTranscriptionCheckoutPage() {
	const {batchId} = useParams()

	return (
		<PageContainer>
			<BatchTranscriptionStatusTable batchId={batchId} />
		</PageContainer>
	)
}
