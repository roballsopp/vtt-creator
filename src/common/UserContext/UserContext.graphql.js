import {gql} from '@apollo/client'

export const UserContext_userFragment = gql`
	fragment UserContext_user on User {
		id
		email
		credit
		creditMinutes
		unlimitedUsage
	}
`
