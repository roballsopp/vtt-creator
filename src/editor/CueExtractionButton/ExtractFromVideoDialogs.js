import * as React from 'react'
import {useUser} from '../../common'
import {useExtractFromVideo} from './ExtractFromVideoContext'
import CreditDialog from './CreditDialog'
import CueExtractionDialog from './cue-extraction-dialog.component'
import NotSupportedDialog from './NotSupportedDialog'

export default function ExtractFromVideoDialogs() {
	const {
		creditDialogOpen,
		cueExtractionDialogOpen,
		notSupportedDialogOpen,
		handleCueExtractionDialogClose,
		handleCreditDialogPaid,
		handleCreditDialogClose,
		handleCreditDialogExited,
		handleCueExtractComplete,
		handleNotSupportedDialogClose,
	} = useExtractFromVideo()

	const {user} = useUser()

	return (
		<React.Fragment>
			<CueExtractionDialog
				open={cueExtractionDialogOpen}
				onRequestClose={handleCueExtractionDialogClose}
				onExtractComplete={handleCueExtractComplete}
			/>
			{user ? (
				<CreditDialog
					user={user}
					open={creditDialogOpen}
					onPaid={handleCreditDialogPaid}
					onExited={handleCreditDialogExited}
					onClose={handleCreditDialogClose}
				/>
			) : null}
			<NotSupportedDialog open={notSupportedDialogOpen} onClose={handleNotSupportedDialogClose} />
		</React.Fragment>
	)
}
