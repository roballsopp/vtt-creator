import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Splash from './splash.component';

export default function SplashContainer() {
	const { data } = useQuery(gql`
		query getUser {
			self {
				id
				...SplashUser
			}
		}
		${Splash.fragments.user}
	`);

	const user = data ? data.self : null;

	return <Splash user={user} />;
}
