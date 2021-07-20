import {gql} from '@apollo/client'
import {AddCreditInput_userFragment} from './AddCreditInput/AddCreditInput.graphql'

export const AccountPage_userFragment = gql`
	fragment AccountPage_user on User {
		id
		email
		credit
		creditMinutes
		unlimitedUsage
		...AddCreditInput_user
	}
	${AddCreditInput_userFragment}
`
