import * as React from 'react';
import { useExtractFromVideo } from './ExtractFromVideoContext';
import LoginDialog from './LoginDialog';
import CreditDialog from './CreditDialog';
import CueExtractionDialog from './cue-extraction-dialog.component';

export default function ExtractFromVideoDialogs() {
	const {
		loginDialogOpen,
		creditDialogOpen,
		cueExtractionDialogOpen,
		handleCueExtractionDialogClose,
		handleLoginDialogClose,
		handleLoginDialogExited,
		handleCreditDialogPaid,
		handleCreditDialogClose,
		handleCreditDialogExited,
		handleCueExtractComplete,
	} = useExtractFromVideo();

	return (
		<React.Fragment>
			<CueExtractionDialog
				open={cueExtractionDialogOpen}
				onRequestClose={handleCueExtractionDialogClose}
				onExtractComplete={handleCueExtractComplete}
			/>
			<LoginDialog open={loginDialogOpen} onExited={handleLoginDialogExited} onClose={handleLoginDialogClose} />
			<CreditDialog
				open={creditDialogOpen}
				onPaid={handleCreditDialogPaid}
				onExited={handleCreditDialogExited}
				onClose={handleCreditDialogClose}
			/>
		</React.Fragment>
	);
}
