import React from 'react'
import {gql, useQuery} from '@apollo/client'
import AccountPage from './AccountPage'
import {handleError} from '../services/error-handler.service'
import PageLoader from '../common/PageLoader'
import PageError from '../common/PageError'

export default function AccountPageQueryContainer() {
	const {loading, data, error, refetch} = useQuery(
		gql`
			query AccountPageGetUser {
				self {
					...AccountPage_user
				}
				transcriptionRate
				translationRate
			}
			${AccountPage.fragments.user}
		`,
		{
			onError: err => handleError(err),
		}
	)

	if (loading) {
		return <PageLoader />
	}

	if (error) {
		return <PageError retry={refetch} />
	}

	return (
		<AccountPage user={data.self} transcriptionRate={data.transcriptionRate} translationRate={data.translationRate} />
	)
}
