import * as React from 'react'
import {Button, Paper} from '@material-ui/core'
import PageContainer from '../common/PageContainer'
import {UploadProvider} from './UploadProvider'
import UploadForm from './UploadForm'

export default function BatchPage() {
	return (
		<PageContainer
			headerRight={
				<Button color="secondary" variant="contained" href="/editor">
					Editor
				</Button>
			}>
			<UploadProvider>
				<Paper>
					<UploadForm />
				</Paper>
			</UploadProvider>
		</PageContainer>
	)
}
