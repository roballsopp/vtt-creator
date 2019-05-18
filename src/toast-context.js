import * as React from 'react';
import * as PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiSnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

const variantIcon = {
	success: CheckCircleIcon,
	error: ErrorIcon,
};

const ToastContext = React.createContext({
	error: () => {},
	success: () => {},
});

const useStyles = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	indicatorIcon: {
		fontSize: 20,
		marginLeft: -8,
		marginRight: 8,
	},
	closeIcon: {
		fontSize: 20,
	},
	close: {
		margin: -12,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}));

SnackbarContent.propTypes = {
	className: PropTypes.string,
	message: PropTypes.node,
	onClose: PropTypes.func,
	variant: PropTypes.oneOf(['success', 'error']).isRequired,
};

function SnackbarContent(props) {
	const classes = useStyles();
	const { className, message, onClose, variant, ...other } = props;
	const Icon = variantIcon[variant];

	return (
		<MuiSnackbarContent
			className={classes[variant]}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
          <Icon className={classes.indicatorIcon} />
					{message}
        </span>
			}
			action={[
				<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					className={classes.close}
					onClick={onClose}
				>
					<CloseIcon className={classes.closeIcon} />
				</IconButton>,
			]}
			{...other}
		/>
	);
}

ToastProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function ToastProvider(props) {
	const [options, setOptions] = React.useState({
		vertical: 'bottom',
		horizontal: 'center',
	});
	const [show, setShow] = React.useState(false);
	const [snackBarConfig, setSnackBarConfig] = React.useState({ variant: 'success' });

	const openSuccessToast = (message, options = {}) => {
		setOptions(options);
		setSnackBarConfig({ message, variant: 'success' });
		setShow(true);
	};

	const openErrorToast = (message, options = {}) => {
		setOptions(options);
		setSnackBarConfig({ message, variant: 'error' });
		setShow(true);
	};

	return (
		<ToastContext.Provider
			value={{
				error: openErrorToast,
				success: openSuccessToast,
			}}>
			{props.children}
			<Snackbar
				anchorOrigin={{
					vertical: options.vertical || 'bottom',
					horizontal: options.horizontal || 'center',
				}}
				autoHideDuration={4000}
				open={show}
				onClose={() => setShow(false)}
			>
				<SnackbarContent
					onClose={() => setShow(false)}
					{...snackBarConfig}
				/>
			</Snackbar>
		</ToastContext.Provider>
	);
}

export function useToast() {
	return React.useContext(ToastContext);
}
