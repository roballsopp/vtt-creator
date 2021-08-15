import React from 'react'
import PropTypes from 'prop-types'
import {gql, useQuery} from '@apollo/client'
import * as Sentry from '@sentry/browser'
import {UserContext_userFragment} from './UserContext.graphql'

const UserContext = React.createContext({
	userLoading: false,
	userError: null,
	user: null,
	getUser: () => undefined,
})

UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function UserProvider({children}) {
	const {loading, data, error} = useQuery(
		gql`
			query UserContextGetUser {
				self {
					...UserContext_user
				}
			}
			${UserContext_userFragment}
		`,
		{
			onCompleted: data => {
				Sentry.setUser(data.self)
				window.gtag('config', 'GA_MEASUREMENT_ID', {user_id: data.self.id})
			},
		}
	)

	const userRef = React.useRef()
	userRef.current = data?.self

	const getUser = React.useCallback(() => {
		return userRef.current
	}, [])

	return (
		<UserContext.Provider
			value={{
				userLoading: loading,
				userError: error,
				user: data?.self,
				getUser,
			}}>
			{children}
		</UserContext.Provider>
	)
}

export function useUser() {
	return React.useContext(UserContext)
}
