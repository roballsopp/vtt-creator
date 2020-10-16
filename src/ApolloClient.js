import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, from, Observable } from '@apollo/client';
import { ApiURL, cognitoUserPool } from './config';
import { UnauthorizedError } from './errors';
import { handleError } from './services/error-handler.service';

const httpLink = createHttpLink({
	uri: `${ApiURL}/graphql`,
});

let refreshing = false;

const authLink = new ApolloLink((operation, forward) => {
	return new Observable(observer => {
		const cognitoUser = cognitoUserPool.getCurrentUser();
		if (!cognitoUser) {
			return observer.error(new UnauthorizedError('No user'));
		}

		cognitoUser.getSession((err, session) => {
			if (err) {
				return observer.error(new UnauthorizedError(`Session error: ${err}`));
			}

			operation.setContext(({ headers }) => ({
				headers: {
					...headers,
					authorization: `Bearer ${session.getIdToken().getJwtToken()}`,
				},
			}));

			// if we have a token, go ahead and run next link (which eventually is the httplink)
			forward(operation).subscribe({
				// if that link calls next, just pass it though
				// TODO: check graphql errors (in result.errors) and potentially throw new error types
				next: result => observer.next(result),
				// if it fails, check for a 401 and throw the proper error if it happens
				error: networkError => {
					if (networkError.statusCode === 401) {
						return observer.error(new UnauthorizedError('Bad token'));
					}
					observer.error(networkError);
				},
				// if that link calls complete, refresh auth and just pass through
				complete: () => {
					observer.complete();
					const refreshToken = session.getRefreshToken();
					// if we don't have a refresh token, or we are already refreshing, don't try to refresh
					if (!refreshToken || refreshing) return;

					refreshing = true;
					// refresh on each request for sliding window
					cognitoUser.refreshSession(refreshToken, err => {
						refreshing = false;
						// refresh token probably expired, just log error
						if (err) handleError(err);
					});
				},
			});
		});
	});
});

export default new ApolloClient({
	link: from([authLink, httpLink]),
	cache: new InMemoryCache({
		typePolicies: {
			User: {
				keyFields: ['id'],
			},
		},
	}),
});
