import React from 'react'
import PropTypes from 'prop-types'
import {gql, useQuery} from '@apollo/client'
import {TranslationCost} from '../../config'
import {useCues} from '../../common'
import {useAuthDialog} from '../../AuthDialog'
import CreditDialog from '../CueExtractionButton/CreditDialog'
import {TranslationProvider_userFragment} from './translation-context.graphql'
import TranslationDialog from './TranslationDialog'

const TranslationContext = React.createContext({
	loading: true,
	handleTranslationDialogOpen: () => {},
})

TranslationProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function TranslationProvider({children}) {
	const {cues} = useCues()
	const {openLoginDialog, authDialogEvents} = useAuthDialog()
	const queryDataRef = React.useRef()

	const numCharacters = React.useMemo(() => {
		return cues.reduce((total, cue) => {
			return total + cue.text.length
		}, 0)
	}, [cues])

	const [translationDialogOpen, setTranslationDialogOpen] = React.useState(false)
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false)
	const creditDialogPaid = React.useRef(false)

	const {loading, data} = useQuery(
		gql`
			query TranslationContextGetCost($numCharacters: Int!) {
				self {
					...TranslationProvider_user
					...CreditDialogUser
				}
				translationCost(numCharacters: $numCharacters)
			}
			${TranslationProvider_userFragment}
			${CreditDialog.fragments.user}
		`,
		{
			variables: {numCharacters},
		}
	)

	queryDataRef.current = data

	const handleTranslationDialogOpen = React.useCallback(() => {
		// if error getting cost, we aren't logged in
		if (!queryDataRef.current) {
			authDialogEvents.once('exited', () => {
				// if the query succeeded at some point during the time the login
				//   dialog was open, we probably logged in and we can try again
				if (queryDataRef.current) handleTranslationDialogOpen()
			})
			return openLoginDialog(
				`Automatic translation costs $${TranslationCost.toFixed(
					2
				)} per 100 characters and requires an account. Please login or sign up below.`
			)
		}

		const {self, translationCost} = queryDataRef.current

		if (translationCost > self.credit && !self.unlimitedUsage) {
			return setCreditDialogOpen(true)
		}

		setTranslationDialogOpen(true)
	}, [openLoginDialog, authDialogEvents])

	const handleTranslationDialogClose = () => {
		setTranslationDialogOpen(false)
	}

	const handleCreditDialogPaid = () => {
		creditDialogPaid.current = true
		setCreditDialogOpen(false)
	}

	const handleCreditDialogClose = () => {
		setCreditDialogOpen(false)
	}

	const handleCreditDialogExited = () => {
		if (creditDialogPaid.current) {
			creditDialogPaid.current = false
			handleTranslationDialogOpen()
		}
	}

	return (
		<TranslationContext.Provider
			value={{
				loading,
				handleTranslationDialogOpen,
			}}>
			{children}
			<TranslationDialog
				translationCost={data?.translationCost || 0}
				open={translationDialogOpen}
				onRequestClose={handleTranslationDialogClose}
			/>
			{data?.self && (
				<CreditDialog
					user={data?.self}
					transcriptionCost={data?.translationCost || 0}
					open={creditDialogOpen}
					onPaid={handleCreditDialogPaid}
					onExited={handleCreditDialogExited}
					onClose={handleCreditDialogClose}
				/>
			)}
		</TranslationContext.Provider>
	)
}

export function useTranslate() {
	return React.useContext(TranslationContext)
}
