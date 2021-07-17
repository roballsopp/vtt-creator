import * as React from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { SpeechToTextJobTimeout } from '../../config';

export default function useApiHelper() {
	const apolloClient = useApolloClient();

	return React.useMemo(
		() => ({
			getUploadUrl: async () => {
				const {
					data: { uploadUrl },
				} = await apolloClient.query({
					fetchPolicy: 'network-only',
					query: gql`
						query getUploadUrl {
							uploadUrl {
								filename
								url
							}
						}
					`,
				});
				return uploadUrl;
			},
			initTranscription: async (filename, languageCode) => {
				const {
					data: { beginTranscription },
				} = await apolloClient.mutate({
					mutation: gql`
						mutation initTranscription($filename: String!, $languageCode: String!) {
							beginTranscription(filename: $filename, languageCode: $languageCode) {
								job {
									id
									user {
										id
									}
									state
								}
							}
						}
					`,
					variables: { filename, languageCode },
				});
				return beginTranscription;
			},
			pollTranscriptionJob: (jobId, interval = 1000, timeout = SpeechToTextJobTimeout) => {
				let intervalId;
				return {
					promise: new Promise((resolve, reject) => {
						intervalId = setInterval(async () => {
							apolloClient
								.query({
									fetchPolicy: 'network-only',
									query: gql`
										query getTranscriptionJob($jobId: String!) {
											transcriptionJob(jobId: $jobId) {
												id
												state
												transcript {
													words {
														startTime
														endTime
														word
													}
												}
											}
										}
									`,
									variables: { jobId },
								})
								.then(({ data: { transcriptionJob } }) => {
									if (transcriptionJob.state !== 'pending') {
										clearInterval(intervalId);
										resolve(transcriptionJob.transcript);
									}
								})
								.catch(err => {
									clearInterval(intervalId);
									if (err.networkError) {
										if (err.networkError.result) {
											return reject(new Error(err.networkError.result.errors[0].message));
										}
										return reject(err.networkError);
									}
									reject(new Error(err));
								});
						}, interval);

						setTimeout(() => {
							clearInterval(intervalId);
							reject(new Error('Poll timeout exceeded.'));
						}, timeout);
					}),
					cancel: () => clearInterval(intervalId),
				};
			},
			cancelTranscription: async jobId => {
				const {
					data: { cancelTranscription },
				} = await apolloClient.mutate({
					mutation: gql`
						mutation cancelTranscription($jobId: String!) {
							cancelTranscription(jobId: $jobId) {
								job {
									id
									state
								}
							}
						}
					`,
					variables: { jobId },
				});
				return cancelTranscription;
			},
		}),
		[apolloClient]
	);
}
