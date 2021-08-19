import React from 'react'
import throttle from 'lodash/throttle'
import PropTypes from 'prop-types'
import {gql, useApolloClient} from '@apollo/client'
import {uploadFile} from '../services/rest-api.service'
import {handleError} from '../services/error-handler.service'

const UploadContext = React.createContext({
	uploadState: {},
	handleAddFiles: () => undefined,
	handleRemoveFile: () => undefined,
	handleUpload: () => undefined,
})

UploadProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function UploadProvider({children}) {
	const apolloClient = useApolloClient()

	const [uploadState, setUploadState] = React.useState({
		uploading: false,
		uploads: [],
	})

	const handleAddFiles = React.useCallback(files => {
		const newUploads = files.map(file => ({
			state: 'queued',
			file,
			loaded: 0,
			total: file.size || 0,
			error: null,
		}))

		setUploadState(u => ({
			...u,
			uploads: [...u.uploads, ...newUploads],
		}))
	}, [])

	const handleRemoveFile = React.useCallback(idx => {
		setUploadState(u => ({
			...u,
			uploads: u.uploads.filter((_, i) => i !== idx),
		}))
	}, [])

	const handleUploadDone = React.useCallback(() => {
		console.log('done')
	}, [])

	const handleUpload = React.useCallback(() => {
		const uploadQueue = uploadState.uploads.map((upload, idx) => {
			return async () => {
				setUploadState(u => ({
					...u,
					uploads: u.uploads.map((u, i) => {
						if (i === idx) return {...u, state: 'uploading'}
						return u
					}),
				}))

				const {
					data: {videoUploadUrl},
				} = await apolloClient.query({
					fetchPolicy: 'no-cache',
					query: gql`
						query getVideoUploadUrl {
							videoUploadUrl {
								filename
								url
							}
						}
					`,
					context: {queryDeduplication: false},
				})

				const handleProgress = throttle(e => {
					setUploadState(u => ({
						...u,
						uploads: u.uploads.map((u, i) => {
							if (i === idx) return {...u, loaded: e.loaded, total: e.total}
							return u
						}),
					}))
				}, 500)

				const uploader = uploadFile(upload.file, videoUploadUrl.url, handleProgress)

				return uploader.promise
					.then(() => {
						setUploadState(u => ({
							...u,
							uploads: u.uploads.map((u, i) => {
								if (i === idx) return {...u, state: 'done'}
								return u
							}),
						}))
					})
					.then(async () => {
						const {
							data: {beginVideoTranscription},
						} = await apolloClient.mutate({
							mutation: gql`
								mutation initTranscription($filename: String!, $languageCode: String!) {
									beginVideoTranscription(filename: $filename, languageCode: $languageCode) {
										job {
											id
											state
										}
									}
								}
							`,
							variables: {filename: videoUploadUrl.filename, languageCode: 'en-GB'},
						})

						console.log('yoo', beginVideoTranscription)
					})
					.catch(error => {
						console.error('yoou', error)
						setUploadState(u => ({
							...u,
							uploads: u.uploads.map((u, i) => {
								if (i === idx) return {...u, state: 'error', error}
								return u
							}),
						}))
					})
			}
		})

		setUploadState(u => ({...u, uploading: true}))
		processQueue(uploadQueue, () => setUploadState(u => ({...u, uploading: false})))
	}, [apolloClient, uploadState])

	return (
		<UploadContext.Provider
			value={{
				uploadState,
				handleAddFiles,
				handleRemoveFile,
				handleUpload,
			}}>
			{children}
		</UploadContext.Provider>
	)
}

function processQueue(queue, onDone, concurrency = 3) {
	let numInProgress = 0

	function processItems() {
		if (!queue.length && !numInProgress) return onDone()

		while (queue.length && numInProgress < concurrency) {
			numInProgress++
			const item = queue.shift()
			// eslint-disable-next-line no-loop-func
			item?.().finally(() => {
				numInProgress--
				processItems()
			})
		}
	}

	processItems()
}

export function useUpload() {
	return React.useContext(UploadContext)
}
