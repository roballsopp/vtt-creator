import * as React from 'react'
import {useParams} from 'react-router-dom'
import {Button, Paper} from '@material-ui/core'
import PageContainer from '../common/PageContainer'
import {UploadProvider} from './UploadProvider'
import BatchTranscriptionTable from './BatchTranscriptionTableContainer'

export default function BatchPage() {
	const {batchId} = useParams()
	return (
		<PageContainer
			headerRight={
				<Button color="secondary" variant="contained" href="/editor">
					Editor
				</Button>
			}>
			<UploadProvider>
				<Paper>
					<BatchTranscriptionTable batchId={batchId} />
				</Paper>
			</UploadProvider>
		</PageContainer>
	)
}
