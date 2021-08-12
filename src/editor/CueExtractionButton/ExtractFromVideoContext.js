import React from 'react'
import PropTypes from 'prop-types'
import {gql} from '@apollo/client'
import {TranscriptionCost} from '../../config'
import {useCues, usePromiseLazyQuery} from '../../common'
import {useDuration} from '../../common/video'
import {getCuesFromWords} from '../../services/vtt.service'
import {useAuthDialog} from '../../AuthDialog'
import CueExtractionDialog from './cue-extraction-dialog.component'
import CreditDialog from './CreditDialog'
import NotSupportedDialog from './NotSupportedDialog'

const ExtractFromVideoContext = React.createContext({
	loading: true,
	handleCueExtractionDialogOpen: () => {},
})

ExtractFromVideoProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function ExtractFromVideoProvider({children}) {
	const {setCues, setCuesLoading} = useCues()
	const {openLoginDialog, authDialogEvents} = useAuthDialog()
	const {duration} = useDuration()

	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false)
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false)
	const [notSupportedDialogOpen, setNotSupportedDialogOpen] = React.useState(false)

	const [getCost, {loading, data}] = usePromiseLazyQuery(
		gql`
			query ExtractFromVideoContextGetCost($duration: Float!) {
				canIAffordTranscription(duration: $duration)
				transcriptionCost(duration: $duration)
			}
		`,
		{
			variables: {duration},
			fetchPolicy: 'no-cache',
		}
	)

	const handleCueExtractionDialogOpen = React.useCallback(() => {
		if (!window.AudioContext) return setNotSupportedDialogOpen(true)

		getCost()
			.then(({data}) => {
				if (!data.canIAffordTranscription) return setCreditDialogOpen(true)
				setCueExtractionDialogOpen(true)
			})
			// if error refetching, we probably aren't logged in
			.catch(() => {
				authDialogEvents.once('exited', justLoggedIn => {
					if (justLoggedIn) handleCueExtractionDialogOpen()
				})
				openLoginDialog(
					`Automatic caption extraction costs $${TranscriptionCost.toFixed(
						2
					)} per minute of video and requires an account. Please login or sign up below.`
				)
			})
	}, [authDialogEvents, openLoginDialog, getCost])

	const handleCueExtractionDialogClose = () => {
		setCueExtractionDialogOpen(false)
	}

	const handleCreditDialogClose = () => {
		setCreditDialogOpen(false)
	}

	const handleNotSupportedDialogClose = () => {
		setNotSupportedDialogOpen(false)
	}

	const handleCreditDialogExited = justPaid => {
		if (justPaid) handleCueExtractionDialogOpen()
	}

	const handleCueExtractComplete = transcript => {
		setCuesLoading(true)
		const newCues = getCuesFromWords(transcript.words)
		setCues(newCues)
		setCuesLoading(false)
	}

	return (
		<ExtractFromVideoContext.Provider
			value={{
				loading,
				handleCueExtractionDialogOpen,
			}}>
			{children}
			<CueExtractionDialog
				transcriptionCost={data?.transcriptionCost || 0}
				open={cueExtractionDialogOpen}
				onRequestClose={handleCueExtractionDialogClose}
				onExtractComplete={handleCueExtractComplete}
			/>
			<CreditDialog
				cost={data?.transcriptionCost || 0}
				open={creditDialogOpen}
				onExited={handleCreditDialogExited}
				onClose={handleCreditDialogClose}
			/>
			<NotSupportedDialog open={notSupportedDialogOpen} onClose={handleNotSupportedDialogClose} />
		</ExtractFromVideoContext.Provider>
	)
}

export function useExtractFromVideo() {
	return React.useContext(ExtractFromVideoContext)
}
