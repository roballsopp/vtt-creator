import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache, from, Observable} from '@apollo/client'
import {cognitoUserPool} from './cognito'
import {ApiURL} from './config'
import {UnauthorizedError} from './errors'

const httpLink = createHttpLink({
	uri: `${ApiURL}/graphql`,
})

const authLink = new ApolloLink((operation, forward) => {
	return new Observable(observer => {
		const cognitoUser = cognitoUserPool.getCurrentUser()
		if (!cognitoUser) {
			return observer.error(new UnauthorizedError('No user'))
		}

		// cognitoUser.refreshSession is called under the hood here when the session becomes invalid. In that case, a refreshed session will be returned
		// https://github.com/aws-amplify/amplify-js/blob/master/packages/amazon-cognito-identity-js/src/CognitoUser.js#L1418
		cognitoUser.getSession((err, session) => {
			if (err) {
				return observer.error(new UnauthorizedError(`Cognito session error: ${err.message}`))
			}

			operation.setContext(({headers}) => ({
				headers: {
					...headers,
					authorization: `Bearer ${session.getIdToken().getJwtToken()}`,
				},
			}))

			// if we have a token, go ahead and run next link (which eventually is the httplink)
			forward(operation).subscribe({
				// if that link calls next, just pass it though
				// TODO: check graphql errors (in result.errors) and potentially throw new error types
				next: result => observer.next(result),
				// if it fails, check for a 401 and throw the proper error if it happens
				error: networkError => {
					if (networkError.statusCode === 401) {
						return observer.error(new UnauthorizedError('Bad token'))
					}
					observer.error(networkError)
				},
				complete: () => observer.complete(),
			})
		})
	})
})

export default new ApolloClient({
	link: from([authLink, httpLink]),
	cache: new InMemoryCache({
		typePolicies: {
			User: {
				keyFields: ['id'],
			},
			TranscriptionJobsConnection: {
				fields: {
					nodes: {
						// Don't cache separate results based on any of this field's arguments.
						keyArgs: ['batchId'],
						merge(existing, incoming, {args: {offset = 0}}) {
							const merged = existing ? existing.slice(0) : []
							for (let i = 0; i < incoming.length; ++i) {
								merged[offset + i] = incoming[i]
							}
							return merged
						},
						read(existing, {args: {offset, limit}}) {
							// no cached list, time to fetch the first page
							if (!existing) return undefined
							// get the page we want from the cache
							const cachedPage = existing.slice(offset, offset + limit)
							// if we have a cached list, but it doesn't have the the page we want now, so make a fetch
							if (!cachedPage.length) return undefined
							// we have a cached list, and there is at least some data in there from the page we want, just return that
							return cachedPage
						},
					},
				},
			},
			TranslationsConnection: {
				fields: {
					nodes: {
						// Don't cache separate results based on any of this field's arguments.
						keyArgs: false,
						merge(existing, incoming, {args: {offset = 0}}) {
							const merged = existing ? existing.slice(0) : []
							for (let i = 0; i < incoming.length; ++i) {
								merged[offset + i] = incoming[i]
							}
							return merged
						},
						read(existing, {args: {offset, limit}}) {
							// no cached list, time to fetch the first page
							if (!existing) return undefined
							// get the page we want from the cache
							const cachedPage = existing.slice(offset, offset + limit)
							// if we have a cached list, but it doesn't have the the page we want now, so make a fetch
							if (!cachedPage.length) return undefined
							// we have a cached list, and there is at least some data in there from the page we want, just return that
							return cachedPage
						},
					},
				},
			},
		},
	}),
})
