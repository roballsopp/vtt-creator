import React from 'react'
import PropTypes from 'prop-types'
import {gql, useQuery} from '@apollo/client'
import {ExtractFromVideoContext_userFragment} from './ExtractFromVideoContext.graphql'
import {TranscriptionCost} from '../../config'
import {useCues} from '../../common'
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
	const queryDataRef = React.useRef()

	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false)
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false)
	const [notSupportedDialogOpen, setNotSupportedDialogOpen] = React.useState(false)
	const creditDialogPaid = React.useRef(false)

	const {loading, data} = useQuery(
		gql`
			query ExtractFromVideoContextGetCost($duration: Float!) {
				self {
					...ExtractFromVideoContext_user
				}
				transcriptionCost(duration: $duration)
			}
			${ExtractFromVideoContext_userFragment}
		`,
		{
			variables: {duration},
		}
	)

	queryDataRef.current = data

	const handleCueExtractionDialogOpen = React.useCallback(() => {
		if (!window.AudioContext) return setNotSupportedDialogOpen(true)

		// if error getting cost, we aren't logged in
		if (!queryDataRef.current) {
			authDialogEvents.once('exited', () => {
				// if the query succeeded at some point during the time the login
				//   dialog was open, we probably logged in and we can try again
				if (queryDataRef.current) handleCueExtractionDialogOpen()
			})
			return openLoginDialog(
				`Automatic caption extraction costs $${TranscriptionCost.toFixed(
					2
				)} per minute of video and requires an account. Please login or sign up below.`
			)
		}

		const {self, transcriptionCost} = queryDataRef.current

		if (transcriptionCost > self.credit && !self.unlimitedUsage) {
			return setCreditDialogOpen(true)
		}

		setCueExtractionDialogOpen(true)
	}, [openLoginDialog, authDialogEvents])

	const handleCueExtractionDialogClose = () => {
		setCueExtractionDialogOpen(false)
	}

	const handleCreditDialogPaid = () => {
		creditDialogPaid.current = true
		setCreditDialogOpen(false)
	}

	const handleCreditDialogClose = () => {
		setCreditDialogOpen(false)
	}

	const handleNotSupportedDialogClose = () => {
		setNotSupportedDialogOpen(false)
	}

	const handleCreditDialogExited = () => {
		if (creditDialogPaid.current) {
			creditDialogPaid.current = false
			handleCueExtractionDialogOpen()
		}
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
			{data?.self && (
				<CreditDialog
					user={data?.self}
					transcriptionCost={data?.transcriptionCost || 0}
					open={creditDialogOpen}
					onPaid={handleCreditDialogPaid}
					onExited={handleCreditDialogExited}
					onClose={handleCreditDialogClose}
				/>
			)}
			<NotSupportedDialog open={notSupportedDialogOpen} onClose={handleNotSupportedDialogClose} />
		</ExtractFromVideoContext.Provider>
	)
}

export function useExtractFromVideo() {
	return React.useContext(ExtractFromVideoContext)
}
