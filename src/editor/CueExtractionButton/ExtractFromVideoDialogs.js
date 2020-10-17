import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useExtractFromVideo } from './ExtractFromVideoContext';
import CreditDialog from './CreditDialog';
import CueExtractionDialog from './cue-extraction-dialog.component';

ExtractFromVideoDialogs.fragments = {
	user: gql`
		fragment ExtractFromVideoDialogsUser on User {
			id
			...CreditDialogUser
		}
		${CreditDialog.fragments.user}
	`,
};

ExtractFromVideoDialogs.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
};

export default function ExtractFromVideoDialogs({ user }) {
	const {
		creditDialogOpen,
		cueExtractionDialogOpen,
		handleCueExtractionDialogClose,
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
			{user && (
				<CreditDialog
					user={user}
					open={creditDialogOpen}
					onPaid={handleCreditDialogPaid}
					onExited={handleCreditDialogExited}
					onClose={handleCreditDialogClose}
				/>
			)}
		</React.Fragment>
	);
}
