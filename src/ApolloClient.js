import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApiURL } from './config';
import { getAuthToken } from './services/storage.service';

const httpLink = createHttpLink({
	uri: `${ApiURL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const authToken = getAuthToken();

	return {
		headers: {
			...headers,
			authorization: `Bearer ${authToken}`,
		},
	};
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
