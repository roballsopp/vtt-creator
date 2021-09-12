import * as React from 'react'
import {useParams} from 'react-router-dom'
import PageContainer from '../common/PageContainer'
import BatchTranscriptionCart from './BatchTranscriptionCartContainer'

export default function BatchTranscriptionCheckoutPage() {
	const {batchId} = useParams()
	return (
		<PageContainer>
			<BatchTranscriptionCart batchId={batchId} />
		</PageContainer>
	)
}
