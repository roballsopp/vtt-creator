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
									operationId
									state
								}
							}
						}
					`,
					variables: { filename, languageCode },
				});
				return beginTranscription;
			},
			pollTranscriptionJob: (operationId, interval = 1000, timeout = SpeechToTextJobTimeout) => {
				return new Promise((resolve, reject) => {
					const intervalId = setInterval(async () => {
						apolloClient
							.query({
								fetchPolicy: 'network-only',
								query: gql`
									query getSpeechToTextOp($operationId: String!) {
										speechToTextOp(operationId: $operationId) {
											done
											results {
												alternatives {
													confidence
													words {
														startTime
														endTime
														word
													}
												}
											}
										}
									}
								`,
								variables: { operationId },
							})
							.then(({ data: { speechToTextOp } }) => {
								if (speechToTextOp.done) {
									clearInterval(intervalId);
									resolve(speechToTextOp.results);
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
				});
			},
			finishTranscription: async operationId => {
				const {
					data: { finishTranscription },
				} = await apolloClient.mutate({
					mutation: gql`
						mutation finishTranscription($operationId: String!) {
							finishTranscription(operationId: $operationId) {
								job {
									id
									state
								}
								user {
									id
									credit
								}
							}
						}
					`,
					variables: { operationId },
				});
				return finishTranscription;
			},
			failTranscription: async operationId => {
				const {
					data: { failTranscription },
				} = await apolloClient.mutate({
					mutation: gql`
						mutation failTranscription($operationId: String!) {
							failTranscription(operationId: $operationId) {
								job {
									id
									state
								}
							}
						}
					`,
					variables: { operationId },
				});
				return failTranscription;
			},
		}),
		[apolloClient]
	);
}
