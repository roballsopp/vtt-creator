import {gql} from '@apollo/client'
import {CreditDialog_userFragment} from '../CueExtractionButton/CreditDialog.graphql'

export const TranslationProvider_userFragment = gql`
	fragment TranslationProvider_user on User {
		id
		credit
		unlimitedUsage
		...CreditDialogUser
	}
	${CreditDialog_userFragment}
`
