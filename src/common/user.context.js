import { gql, useQuery, useApolloClient } from '@apollo/client';
import EventEmitter from 'events';
import React from 'react';
import PropTypes from 'prop-types';

const UserContext = React.createContext({
	user: null,
	loading: true,
	error: null,
	userEvents: null,
	setUser: () => {},
});

UserProvider.propTypes = {
	children: PropTypes.node,
};

export function UserProvider({ children }) {
	const userEventsRef = React.useRef(new EventEmitter());

	const { loading, data, error } = useQuery(
		gql`
			query getUser {
				self {
					id
					email
					credit
					unlimitedUsage
				}
			}
		`,
		{
			onCompleted: resp => {
				userEventsRef.current.emit('loaded', resp.self);
			},
		}
	);

	const apolloClient = useApolloClient();

	const setUser = React.useCallback(
		user => {
			apolloClient.writeQuery({
				query: gql`
					query {
						self {
							id
							email
							credit
							unlimitedUsage
						}
					}
				`,
				data: {
					self: {
						...user,
						__typename: 'User',
					},
				},
			});
		},
		[apolloClient]
	);

	const user = data ? data.self : null;

	return (
		<UserContext.Provider
			value={{
				user,
				loading,
				error,
				userEvents: userEventsRef.current,
				setUser,
			}}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return React.useContext(UserContext);
}
