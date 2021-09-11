import React from 'react'
import clsx from 'clsx'
import {useHistory} from 'react-router-dom'
import {Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircle'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import EditIcon from '@material-ui/icons/Edit'
import EmailIcon from '@material-ui/icons/Email'
import SignUpIcon from '@material-ui/icons/PersonAdd'
import PrivacyIcon from '@material-ui/icons/Policy'
import {makeStyles} from '@material-ui/styles'
// import {BatchTranscribe, BatchTranslate} from './common/icons'
import {SIDE_NAV_WIDTH, useSideNav} from './NavProvider'
import {useAuthDialog} from './AuthDialog'
import {useUser} from './common/UserContext'
import CreateBatchDialog from './CreateBatchDialog'

const useStyles = makeStyles(theme => ({
	drawer: {
		width: SIDE_NAV_WIDTH,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		border: 0,
	},
	drawerOpen: {
		width: SIDE_NAV_WIDTH,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaper: {
		border: 0,
		zIndex: 1300,
		overflowX: 'hidden',
	},
	drawerHeader: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		height: 48,
		boxShadow: theme.shadows[3],
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: 0,
	},
}))

SideNav.propTypes = {}

export default function SideNav() {
	const history = useHistory()
	const classes = useStyles()
	const {sideNavOpen, sideNavEvents, setSideNavOpen} = useSideNav()
	const {openLoginDialog, openSignupDialog} = useAuthDialog()
	const {userLoading, user} = useUser()

	const [openCreateBatchDialog, setOpenCreateBatchDialog] = React.useState(false)

	const handleClickEditor = () => {
		history.push('/editor')
		setSideNavOpen(false)
	}

	const handleClickAccount = () => {
		history.push('/account')
		setSideNavOpen(false)
	}

	const handleClickPrivacy = () => {
		history.push('/privacy')
		setSideNavOpen(false)
	}

	const handleClickSignUp = () => {
		openSignupDialog()
		setSideNavOpen(false)
	}

	const handleClickLogin = () => {
		openLoginDialog()
		setSideNavOpen(false)
	}

	// const handleOpenCreateBatchDialog = () => {
	// 	setSideNavOpen(false)
	// 	setOpenCreateBatchDialog(true)
	// }

	const handleCloseCreateBatchDialog = () => {
		setOpenCreateBatchDialog(false)
	}

	return (
		<React.Fragment>
			<Drawer
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: sideNavOpen,
					[classes.drawerClose]: !sideNavOpen,
				})}
				variant="permanent"
				anchor="left"
				open={sideNavOpen}
				classes={{
					paper: clsx(classes.drawerPaper, {
						[classes.drawerOpen]: sideNavOpen,
						[classes.drawerClose]: !sideNavOpen,
					}),
				}}
				SlideProps={{
					onEnter: e => sideNavEvents.emit('enter', e),
					onEntering: e => sideNavEvents.emit('entering', e),
					onEntered: e => sideNavEvents.emit('entered', e),
					onExit: e => sideNavEvents.emit('exit', e),
					onExiting: e => sideNavEvents.emit('exiting', e),
					onExited: e => sideNavEvents.emit('exited', e),
				}}>
				<div className={classes.drawerHeader}>
					<Tooltip title="Close Navigation Menu">
						<IconButton color="inherit" onClick={() => setSideNavOpen(false)}>
							<ChevronLeftIcon />
						</IconButton>
					</Tooltip>
				</div>
				<Divider />
				<List>
					<ListItem button onClick={handleClickEditor}>
						<Tooltip title="Caption Editor">
							<ListItemIcon>
								<EditIcon />
							</ListItemIcon>
						</Tooltip>
						<ListItemText primary="Caption Editor" />
					</ListItem>
					{/*<ListItem button onClick={handleOpenCreateBatchDialog}>*/}
					{/*	<Tooltip title="Batch Transcribe">*/}
					{/*		<ListItemIcon>*/}
					{/*			<BatchTranscribe />*/}
					{/*		</ListItemIcon>*/}
					{/*	</Tooltip>*/}
					{/*	<ListItemText primary="Batch Transcribe" />*/}
					{/*</ListItem>*/}
					{/*<ListItem button onClick={handleClickEditor}>*/}
					{/*	<Tooltip title="Batch Translate">*/}
					{/*		<ListItemIcon>*/}
					{/*			<BatchTranslate />*/}
					{/*		</ListItemIcon>*/}
					{/*	</Tooltip>*/}
					{/*	<ListItemText primary="Batch Translate" />*/}
					{/*</ListItem>*/}
					{Boolean(!userLoading && !user) && (
						<React.Fragment>
							<ListItem button onClick={handleClickLogin}>
								<Tooltip title="Login">
									<ListItemIcon>
										<AccountIcon />
									</ListItemIcon>
								</Tooltip>
								<ListItemText primary="Login" />
							</ListItem>
							<ListItem button onClick={handleClickSignUp}>
								<Tooltip title="Sign Up">
									<ListItemIcon>
										<SignUpIcon />
									</ListItemIcon>
								</Tooltip>
								<ListItemText primary="Sign Up" />
							</ListItem>
						</React.Fragment>
					)}
					{Boolean(userLoading || user) && (
						<ListItem button onClick={handleClickAccount} disabled={userLoading}>
							<Tooltip title="Account">
								<ListItemIcon>
									<AccountIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText primary="Account" />
						</ListItem>
					)}
					<ListItem button onClick={handleClickPrivacy}>
						<Tooltip title="Privacy">
							<ListItemIcon>
								<PrivacyIcon />
							</ListItemIcon>
						</Tooltip>
						<ListItemText primary="Privacy" />
					</ListItem>
					<ListItem button component="a" href="mailto:vttcreator@gmail.com" target="_blank">
						<Tooltip title="Contact">
							<ListItemIcon>
								<EmailIcon />
							</ListItemIcon>
						</Tooltip>
						<ListItemText primary="Contact" />
					</ListItem>
				</List>
			</Drawer>
			<CreateBatchDialog open={openCreateBatchDialog} onClose={handleCloseCreateBatchDialog} />
		</React.Fragment>
	)
}
