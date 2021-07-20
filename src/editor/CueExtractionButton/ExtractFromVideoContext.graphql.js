import {gql} from '@apollo/client'
import CreditDialog from './CreditDialog'

export const ExtractFromVideoContext_userFragment = gql`
	fragment ExtractFromVideoContext_user on User {
		id
		credit
		unlimitedUsage
		...CreditDialogUser
	}
	${CreditDialog.fragments.user}
`
