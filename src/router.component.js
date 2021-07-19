import * as React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {Editor} from './editor'
import {Splash} from './splash'
import {AccountPage} from './account'
import PrivacyPage from './privacy'
import {GAProduct} from './config'
import {AuthDialogProvider} from './AuthDialog'

const history = createBrowserHistory()

history.listen(location => {
	window.gtag('config', GAProduct, {page_path: location.pathname + location.search})
})

export default function AppRouter() {
	return (
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
	)
}
