import * as React from 'react'
import {useParams} from 'react-router-dom'
import PageContainer from '../common/PageContainer'
import {UploadProvider} from './UploadProvider'
import BatchTranscriptionCart from './BatchTranscriptionCartContainer'

export default function BatchTranscriptionCheckoutPage() {
	const {batchId} = useParams()
	return (
		<PageContainer>
			<UploadProvider>
				<BatchTranscriptionCart batchId={batchId} />
			</UploadProvider>
		</PageContainer>
	)
}
