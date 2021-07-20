import {gql} from '@apollo/client'

export const AddCreditInput_userFragment = gql`
	fragment AddCreditInput_user on User {
		id
		email
		credit
	}
`
