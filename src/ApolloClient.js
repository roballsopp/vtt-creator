import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache, from, Observable} from '@apollo/client'
import {ApiURL, cognitoUserPool} from './config'
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
		},
	}),
})
