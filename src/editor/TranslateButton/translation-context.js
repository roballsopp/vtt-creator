import React from 'react'
import PropTypes from 'prop-types'
import {gql, useQuery} from '@apollo/client'
import {TranslationCost} from '../../config'
import {useCues} from '../../common'
import {useAuthDialog} from '../../AuthDialog'
import CreditDialog from '../CueExtractionButton/CreditDialog'
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

	const numCharacters = React.useMemo(() => {
		return cues.reduce((total, cue) => {
			return total + cue.text.length
		}, 0)
	}, [cues])

	const [translationDialogOpen, setTranslationDialogOpen] = React.useState(false)
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false)

	const {refetch, loading, data} = useQuery(
		gql`
			query TranslationContextGetCost($numCharacters: Int!) {
				translationCost(numCharacters: $numCharacters)
				canIAffordTranslation(numCharacters: $numCharacters)
			}
		`,
		{
			variables: {numCharacters},
			fetchPolicy: 'no-cache',
		}
	)

	const handleTranslationDialogOpen = React.useCallback(() => {
		refetch()
			.then(({data}) => {
				if (!data.canIAffordTranslation) return setCreditDialogOpen(true)
				setTranslationDialogOpen(true)
			})
			// if refetch failed, we probably aren't logged in
			.catch(() => {
				authDialogEvents.once('exited', justLoggedIn => {
					if (justLoggedIn) handleTranslationDialogOpen()
				})
				openLoginDialog(
					`Automatic translation costs $${TranslationCost.toFixed(
						2
					)} per 100 characters and requires an account. Please login or sign up below.`
				)
			})
	}, [authDialogEvents, openLoginDialog, refetch])

	const handleTranslationDialogClose = () => {
		setTranslationDialogOpen(false)
	}

	const handleCreditDialogClose = () => {
		setCreditDialogOpen(false)
	}

	const handleCreditDialogExited = justPaid => {
		if (justPaid) handleTranslationDialogOpen()
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
			<CreditDialog
				cost={data?.translationCost || 0}
				open={creditDialogOpen}
				onExited={handleCreditDialogExited}
				onClose={handleCreditDialogClose}
			/>
		</TranslationContext.Provider>
	)
}

export function useTranslate() {
	return React.useContext(TranslationContext)
}
