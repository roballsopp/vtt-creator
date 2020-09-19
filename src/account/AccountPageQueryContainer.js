import React from 'react';
import { gql } from '@apollo/client';
import { QueryRenderer } from '../common';
import AccountPage from './AccountPage';

export default function AccountPageQueryContainer() {
	return (
		<QueryRenderer
			render={({ data }) => <AccountPage user={data.self} />}
			query={gql`
				query getUser {
					self {
						...AccountPageUser
					}
				}
				${AccountPage.fragments.user}
			`}
		/>
	);
}
