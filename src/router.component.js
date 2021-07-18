import * as React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {makeStyles} from '@material-ui/styles'
import {Editor} from './editor'
import {Splash} from './splash'
import {AccountPage} from './account'
import PrivacyPage from './privacy'
import {GAProduct} from './config'
import {AuthDialogProvider} from './AuthDialog'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	content: {
		flex: 1,
		display: 'flex',
		minHeight: 0,
		minWidth: 0,
	},
})

const history = createBrowserHistory()

history.listen(location => {
	window.gtag('config', GAProduct, {page_path: location.pathname + location.search})
})

export default function AppRouter() {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Router history={history}>
				<Switch>
					<Route path="/" exact>
						<AuthDialogProvider>
							<Splash />
						</AuthDialogProvider>
					</Route>
					<Route path="/editor" exact>
						<AuthDialogProvider>
							<Editor />
						</AuthDialogProvider>
					</Route>
					<Route path="/account" exact>
						<AuthDialogProvider>
							<AccountPage />
						</AuthDialogProvider>
					</Route>
					<Route path="/privacy" exact>
						<PrivacyPage />
					</Route>
				</Switch>
			</Router>
		</div>
	)
}
