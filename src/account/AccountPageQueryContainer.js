import {makeStyles} from '@material-ui/styles'
import React from 'react'
import {gql, useQuery} from '@apollo/client'
import {useAuthDialog} from '../AuthDialog'
import Loader from '../common/loader.component'
import {UnauthorizedError} from '../errors'
import AccountPage from './AccountPage'

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minHeight: 0,
		minWidth: 0,
	},
}))

export default function AccountPageQueryContainer() {
	const classes = useStyles()
	const {openLoginDialog} = useAuthDialog()

	const {loading, data, error} = useQuery(
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
			onError: error => {
				if (error.networkError instanceof UnauthorizedError) {
					openLoginDialog()
				}
			},
		}
	)

	if (loading || error) {
		return (
			<main className={classes.root}>
				<Loader />
			</main>
		)
	}

	return (
		<AccountPage user={data.self} transcriptionRate={data.transcriptionRate} translationRate={data.translationRate} />
	)
}
