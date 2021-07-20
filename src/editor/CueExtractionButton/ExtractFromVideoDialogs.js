import * as React from 'react'
import {useExtractFromVideo} from './ExtractFromVideoContext'
import CreditDialog from './CreditDialog'
import CueExtractionDialog from './cue-extraction-dialog.component'
import NotSupportedDialog from './NotSupportedDialog'

export default function ExtractFromVideoDialogs() {
	const {
		user,
		transcriptionCost,
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

	return (
		<React.Fragment>
			<CueExtractionDialog
				transcriptionCost={transcriptionCost || 0}
				open={cueExtractionDialogOpen}
				onRequestClose={handleCueExtractionDialogClose}
				onExtractComplete={handleCueExtractComplete}
			/>
			{user && (
				<CreditDialog
					user={user}
					transcriptionCost={transcriptionCost || 0}
					open={creditDialogOpen}
					onPaid={handleCreditDialogPaid}
					onExited={handleCreditDialogExited}
					onClose={handleCreditDialogClose}
				/>
			)}
			<NotSupportedDialog open={notSupportedDialogOpen} onClose={handleNotSupportedDialogClose} />
		</React.Fragment>
	)
}
