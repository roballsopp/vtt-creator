import { gql, useQuery } from '@apollo/client';
import React from 'react';
import PropTypes from 'prop-types';

const UserContext = React.createContext({});

UserProvider.propTypes = {
	children: PropTypes.node,
};

export function UserProvider({ children }) {
	const { loading, data, error } = useQuery(gql`
		query getUser {
			self {
				id
				email
				credit
				unlimitedUsage
			}
		}
	`);

	const user = data ? data.self : null;

	return (
		<UserContext.Provider
			value={React.useMemo(
				() => ({
					user,
					loading,
					error,
				}),
				[user, loading, error]
			)}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return React.useContext(UserContext);
}
