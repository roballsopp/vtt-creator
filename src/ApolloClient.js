import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApiURL } from './config';
import { getAuthToken } from './services/storage.service';

const httpLink = createHttpLink({
	uri: `${ApiURL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
	const authToken = getAuthToken();

	if (authToken) {
		return {
			headers: {
				...headers,
				authorization: `Bearer ${authToken}`,
			},
		};
	}

	return {
		headers,
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
