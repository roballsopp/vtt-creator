import React from 'react';
import EventEmitter from 'events';
import PropTypes from 'prop-types';
import { GetTotalCost, TranscriptionCost } from '../../config';
import { useCues, useUser } from '../../common';
import { useDuration } from '../../common/video';
import { getCuesFromWords } from '../../services/vtt.service';
import { useAuthDialog } from '../../AuthDialog';

const ExtractFromVideoContext = React.createContext({
	creditDialogOpen: false,
	cueExtractionDialogOpen: false,
	notSupportedDialogOpen: false,
	handleCueExtractionDialogOpen: () => {},
	handleCueExtractionDialogClose: () => {},
	handleCreditDialogPaid: () => {},
	handleCreditDialogClose: () => {},
	handleCreditDialogExited: () => {},
	handleCueExtractComplete: () => {},
	handleNotSupportedDialogClose: () => {},
	extractDialogEvents: {},
});

ExtractFromVideoProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function ExtractFromVideoProvider({ children }) {
	const { setCues, setCuesLoading } = useCues();
	const { openLoginDialog, authDialogEvents } = useAuthDialog();
	const { duration } = useDuration();
	const { user } = useUser();
	const extractDialogEvents = React.useRef(new EventEmitter());
	const cost = GetTotalCost(duration);

	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false);
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false);
	const [notSupportedDialogOpen, setNotSupportedDialogOpen] = React.useState(false);
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
		extractDialogEvents.current.emit('opening');

		if (!window.AudioContext) return setNotSupportedDialogOpen(true);

		if (!user) return openLoginPrompt();

		if (cost > user.credit && !user.unlimitedUsage) {
			return setCreditDialogOpen(true);
		}

		setCueExtractionDialogOpen(true);
	}, [cost, user, openLoginPrompt]);

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

	const handleNotSupportedDialogClose = () => {
		setNotSupportedDialogOpen(false);
	};

	const handleCreditDialogExited = () => {
		if (creditDialogPaid.current) {
			creditDialogPaid.current = false;
			handleCueExtractionDialogOpen();
		}
	};

	const handleCueExtractComplete = transcript => {
		setCuesLoading(true);
		const newCues = getCuesFromWords(transcript.words);
		setCues(newCues);
		setCuesLoading(false);
	};

	return (
		<ExtractFromVideoContext.Provider
			value={{
				extractDialogEvents: extractDialogEvents.current,
				creditDialogOpen,
				cueExtractionDialogOpen,
				notSupportedDialogOpen,
				handleCueExtractionDialogOpen,
				handleCueExtractionDialogClose,
				handleCreditDialogPaid,
				handleCreditDialogClose,
				handleCreditDialogExited,
				handleCueExtractComplete,
				handleNotSupportedDialogClose,
			}}>
			{children}
		</ExtractFromVideoContext.Provider>
	);
}

export function useExtractFromVideo() {
	return React.useContext(ExtractFromVideoContext);
}
