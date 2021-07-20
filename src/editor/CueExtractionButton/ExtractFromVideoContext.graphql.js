import {gql} from '@apollo/client'
import {CreditDialog_userFragment} from './CreditDialog.graphql'

export const ExtractFromVideoContext_userFragment = gql`
	fragment ExtractFromVideoContext_user on User {
		id
		credit
		unlimitedUsage
		...CreditDialogUser
	}
	${CreditDialog_userFragment}
`
