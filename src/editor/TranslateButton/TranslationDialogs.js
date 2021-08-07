import * as React from 'react'
import {useTranslate} from './translation-context'
import CreditDialog from '../CueExtractionButton/CreditDialog'
import TranslationDialog from './TranslationDialog'

export default function TranslationDialogs() {
	const {
		translationCost,
		user,
		creditDialogOpen,
		translationDialogOpen,
		handleTranslationDialogClose,
		handleCreditDialogPaid,
		handleCreditDialogClose,
		handleCreditDialogExited,
	} = useTranslate()

	return (
		<React.Fragment>
			<TranslationDialog
				translationCost={translationCost || 0}
				open={translationDialogOpen}
				onRequestClose={handleTranslationDialogClose}
			/>
			{user && (
				<CreditDialog
					user={user}
					transcriptionCost={translationCost || 0}
					open={creditDialogOpen}
					onPaid={handleCreditDialogPaid}
					onExited={handleCreditDialogExited}
					onClose={handleCreditDialogClose}
				/>
			)}
		</React.Fragment>
	)
}
