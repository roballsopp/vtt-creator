import React from 'react';
import PropTypes from 'prop-types';
import { GetTotalCost, TranscriptionCost } from '../../config';
import { useCues, useUser } from '../../common';
import { useDuration } from '../../common/video';
import { getCuesFromWords } from '../../services/vtt.service';
import { useAuthDialog } from '../../AuthDialog';

const ExtractFromVideoContext = React.createContext({
	creditDialogOpen: false,
	cueExtractionDialogOpen: false,
	handleCueExtractionDialogOpen: () => {},
	handleCueExtractionDialogClose: () => {},
	handleCreditDialogPaid: () => {},
	handleCreditDialogClose: () => {},
	handleCreditDialogExited: () => {},
	handleCueExtractComplete: () => {},
});

ExtractFromVideoProvider.propTypes = {
	children: PropTypes.node.isRequired,
	onCloseMenu: PropTypes.func.isRequired,
};

export function ExtractFromVideoProvider({ children, onCloseMenu }) {
	const { onChangeCues, onLoadingCues } = useCues();
	const { openLoginDialog, authDialogEvents } = useAuthDialog();
	const { duration } = useDuration();
	const { user, loading } = useUser();
	const cost = GetTotalCost(duration);

	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false);
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false);
	const [awaitingLogin, setAwaitingLogin] = React.useState(false);
	const creditDialogPaid = React.useRef(false);

	const openLoginPrompt = React.useCallback(() => {
		setAwaitingLogin(true);
		return openLoginDialog(
			`Automatic caption extraction costs $${TranscriptionCost.toFixed(
				2
			)} per minute of video and requires an account. Please login or sign up below.`
		);
	}, [openLoginDialog]);

	const handleCueExtractionDialogOpen = React.useCallback(() => {
		onCloseMenu();

		if (!user) return openLoginPrompt();

		if (cost > user.credit && !user.unlimitedUsage) {
			return setCreditDialogOpen(true);
		}

		setCueExtractionDialogOpen(true);
	}, [cost, user, onCloseMenu, openLoginPrompt]);

	React.useEffect(() => {
		const handleLoginExited = () => {
			if (awaitingLogin && user) handleCueExtractionDialogOpen();
			setAwaitingLogin(false);
		};
		authDialogEvents.on('exited', handleLoginExited);
		return () => {
			authDialogEvents.off('exited', handleLoginExited);
		};
	}, [user, awaitingLogin, authDialogEvents, handleCueExtractionDialogOpen]);

	const handleCueExtractionDialogClose = () => {
		setCueExtractionDialogOpen(false);
	};

	const handleCreditDialogPaid = () => {
		creditDialogPaid.current = true;
		setCreditDialogOpen(false);
	};

	const handleCreditDialogClose = () => {
		setCreditDialogOpen(false);
	};

	const handleCreditDialogExited = () => {
		if (creditDialogPaid.current) {
			creditDialogPaid.current = false;
			handleCueExtractionDialogOpen();
		}
	};

	const handleCueExtractComplete = segments => {
		onLoadingCues(true);
		// for how this concatenation stuff works: https://cloud.google.com/speech-to-text/docs/basics#transcriptions
		const words = segments.reduce((arr, { alternatives }) => {
			return arr.concat(alternatives[0].words);
		}, []);
		const newCues = getCuesFromWords(words);
		onChangeCues(newCues);
		onLoadingCues(false);
	};

	return (
		<ExtractFromVideoContext.Provider
			value={{
				creditDialogOpen,
				cueExtractionDialogOpen,
				handleCueExtractionDialogOpen,
				handleCueExtractionDialogClose,
				handleCreditDialogPaid,
				handleCreditDialogClose,
				handleCreditDialogExited,
				handleCueExtractComplete,
			}}>
			{children}
		</ExtractFromVideoContext.Provider>
	);
}

export function useExtractFromVideo() {
	return React.useContext(ExtractFromVideoContext);
}
