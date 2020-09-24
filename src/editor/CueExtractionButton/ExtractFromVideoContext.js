import * as React from 'react';
import PropTypes from 'prop-types';
import { useCues, useAuth, useCredit } from '../../common';
import { getCuesFromWords } from '../../services/vtt.service';

const ExtractFromVideoContext = React.createContext({
	loginDialogOpen: false,
	creditDialogOpen: false,
	cueExtractionDialogOpen: false,
	handleCueExtractionDialogOpen: () => {},
	handleCueExtractionDialogClose: () => {},
	handleLoginDialogClose: () => {},
	handleLoginDialogExited: () => {},
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
	const { isAuthenticated, user } = useAuth();
	const { cost, credit } = useCredit();

	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false);
	const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false);
	const creditDialogPaid = React.useRef(false);

	const handleCueExtractionDialogOpen = () => {
		onCloseMenu();

		if (!isAuthenticated) {
			return setLoginDialogOpen(true);
		}

		if (cost > credit && !user.unlimitedUsage) {
			return setCreditDialogOpen(true);
		}

		setCueExtractionDialogOpen(true);
	};

	const handleCueExtractionDialogClose = () => {
		setCueExtractionDialogOpen(false);
	};

	const handleLoginDialogClose = () => {
		setLoginDialogOpen(false);
	};

	const handleLoginDialogExited = () => {
		if (isAuthenticated) {
			handleCueExtractionDialogOpen();
		}
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
				loginDialogOpen,
				creditDialogOpen,
				cueExtractionDialogOpen,
				handleCueExtractionDialogOpen,
				handleCueExtractionDialogClose,
				handleLoginDialogClose,
				handleLoginDialogExited,
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
