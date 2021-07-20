import {gql} from '@apollo/client'
import {AddCreditInput_userFragment} from '../../account/AddCreditInput/AddCreditInput.graphql'

export const CreditDialog_userFragment = gql`
	fragment CreditDialogUser on User {
		id
		credit
		...AddCreditInput_user
	}
	${AddCreditInput_userFragment}
`
