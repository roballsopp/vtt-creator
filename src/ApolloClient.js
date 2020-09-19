import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApiURL } from './config';
import { getAuthToken, getAuthTokenExpiration } from './services/storage.service';
import { UnauthorizedError } from './errors';

const httpLink = createHttpLink({
	uri: `${ApiURL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const authToken = getAuthToken();
	// const tokenExpiration = getAuthTokenExpiration();
	//
	// if (!authToken) throw new UnauthorizedError('No token');
	// if (!tokenExpiration || new Date() > tokenExpiration) throw new UnauthorizedError('Token expired');

	return {
		headers: {
			...headers,
			authorization: `Bearer ${authToken}`,
		},
	};
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	// if (networkError.statusCode === 401) {
	// 	throw new UnauthorizedError(networkError.result.message, networkError.result.stack);
	// }

	if (graphQLErrors)
		graphQLErrors.map(({ message, locations, path }) =>
			console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
		);
	if (networkError) console.log(`[Network error]: ${networkError}`);
});

export default new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache({
		typePolicies: {
			User: {
				keyFields: ['id'],
			},
		},
	}),
});
