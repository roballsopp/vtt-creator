import * as React from 'react'
import * as PropTypes from 'prop-types'
import clsx from 'clsx'
import {IconButton, Snackbar as MuiSnackbar, SnackbarContent as MuiSnackbarContent} from '@material-ui/core'
import green from '@material-ui/core/colors/green'
import {makeStyles, withStyles} from '@material-ui/styles'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'

const variantIcon = {
	success: CheckCircleIcon,
	error: ErrorIcon,
}

const ToastContext = React.createContext({
	error: () => {},
	success: () => {},
})

const useStyles = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	contentRoot: {
		flexWrap: 'nowrap',
	},
	indicatorIcon: {
		fontSize: 20,
		marginLeft: -8,
		marginRight: 8,
	},
	closeIcon: {
		fontSize: 20,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}))

SnackbarContent.propTypes = {
	message: PropTypes.node,
	onClose: PropTypes.func,
	variant: PropTypes.oneOf(['success', 'error']).isRequired,
}

function SnackbarContent(props) {
	const classes = useStyles()
	const {message, onClose, variant, ...other} = props
	const Icon = variantIcon[variant]

	return (
		<MuiSnackbarContent
			className={clsx(classes[variant], classes.contentRoot)}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
					<Icon className={classes.indicatorIcon} />
					{message}
				</span>
			}
			action={[
				<IconButton key="close" size="small" edge="end" aria-label="Close" color="inherit" onClick={onClose}>
					<CloseIcon className={classes.closeIcon} />
				</IconButton>,
			]}
			{...other}
		/>
	)
}

const Snackbar = withStyles(theme => ({
	root: {
		[theme.breakpoints.down('sm')]: {
			bottom: 100,
		},
	},
}))(MuiSnackbar)

ToastProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function ToastProvider(props) {
	const toastQueue = React.useRef([])
	const [toastState, setToastState] = React.useState({show: false, ContentProps: {variant: 'success', message: ''}})

	const handleShowNext = React.useCallback(() => {
		setToastState(s => {
			// if were currently showing a toast, do nothing
			if (s.show) return s
			// if there are no more in the queue to show, reset state
			//   if we don't do this (probably reset the message, specifically), the snackbar root seems to hang around in the
			//   dom invisibly and prevent clicks on important stuff under it
			if (!toastQueue.current.length) return {show: false, ContentProps: {variant: 'success', message: ''}}
			const next = toastQueue.current.shift()
			return {
				show: true,
				ContentProps: {
					variant: next.variant,
					message: next.message,
				},
			}
		})
	}, [])

	const pushSuccess = React.useCallback(
		message => {
			toastQueue.current = [...toastQueue.current, {message, variant: 'success'}]
			handleShowNext()
		},
		[handleShowNext]
	)

	const pushError = React.useCallback(
		message => {
			toastQueue.current = [...toastQueue.current, {message, variant: 'error'}]
			handleShowNext()
		},
		[handleShowNext]
	)

	const handleHideToast = (e, reason) => {
		// we already provide a close button, and there is an issue where the snackbar is shown when the video play button
		//   is clicked and errors, and then immediately hidden because the button click causes a clickaway event
		if (reason === 'clickaway') return
		setToastState(s => ({...s, show: false}))
	}

	return (
		<ToastContext.Provider
			value={React.useMemo(
				() => ({
					error: pushError,
					success: pushSuccess,
				}),
				[pushError, pushSuccess]
			)}>
			{props.children}
			<Snackbar
				key={toastState.ContentProps.message}
				autoHideDuration={4000}
				open={toastState.show}
				onClose={handleHideToast}
				TransitionProps={{onExited: handleShowNext}}>
				<SnackbarContent onClose={handleHideToast} {...toastState.ContentProps} />
			</Snackbar>
		</ToastContext.Provider>
	)
}

export function useToast() {
	return React.useContext(ToastContext)
}
