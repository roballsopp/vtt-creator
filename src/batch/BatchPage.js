import * as React from 'react'
import {useParams} from 'react-router-dom'
import PageContainer from '../common/PageContainer'
import {UploadProvider} from './UploadProvider'
import BatchTranscriptionTable from './BatchTranscriptionTableContainer'

export default function BatchPage() {
	const {batchId} = useParams()
	return (
		<PageContainer>
			<UploadProvider>
				<BatchTranscriptionTable batchId={batchId} />
			</UploadProvider>
		</PageContainer>
	)
}
