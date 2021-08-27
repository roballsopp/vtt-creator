import React from 'react'
import clsx from 'clsx'
import {AppBar, Hidden, IconButton, Toolbar} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import {makeStyles} from '@material-ui/styles'
import {SIDE_NAV_WIDTH, useSideNav} from './NavProvider'
import {VC as VCIcon} from './common/icons'
import {Typography} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: 'none',
	},
	grow: {
		flexGrow: 1,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
		marginLeft: SIDE_NAV_WIDTH,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
}))

export default function TopNav() {
	const classes = useStyles()
	const {sideNavOpen, setSideNavOpen} = useSideNav()
	return (
		<Hidden smDown>
			<AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: sideNavOpen})}>
				<Toolbar variant="dense">
					<IconButton
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: sideNavOpen,
						})}
						color="inherit"
						aria-label="Home"
						onClick={() => setSideNavOpen(o => !o)}>
						<MenuIcon />
					</IconButton>
					<VCIcon fontSize="large" edge="start" style={{marginRight: 8}} />
					<Typography variant="h6" color="inherit">
						VTT Creator
					</Typography>
					<div className={classes.grow} />
				</Toolbar>
			</AppBar>
		</Hidden>
	)
}
