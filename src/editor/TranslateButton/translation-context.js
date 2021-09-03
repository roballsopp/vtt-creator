import React from 'react'
import PropTypes from 'prop-types'
import {gql} from '@apollo/client'
import {TranslationCost} from '../../config'
import {useCues, usePromiseLazyQuery} from '../../common'
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
	const {openLoginDialog} = useAuthDialog()

	const numCharacters = React.useMemo(() => {
		return cues.reduce((total, cue) => {
			return total + cue.text.length
		}, 0)
	}, [cues])

	const [translationDialogOpen, setTranslationDialogOpen] = React.useState(false)
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false)

	const [getCost, {loading, data}] = usePromiseLazyQuery(
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
		getCost()
			.then(({data}) => {
				if (!data.canIAffordTranslation) return setCreditDialogOpen(true)
				setTranslationDialogOpen(true)
			})
			// if refetch failed, we probably aren't logged in
			.catch(() => {
				openLoginDialog(
					`Automatic translation costs $${TranslationCost.toFixed(
						2
					)} per 100 characters and requires an account. Please login or sign up below.`
				).then(justLoggedIn => {
					if (justLoggedIn) handleTranslationDialogOpen()
				})
			})
	}, [openLoginDialog, getCost])

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
