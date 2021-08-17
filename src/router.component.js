import * as React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {Editor} from './editor'
import {Splash} from './splash'
import {AccountPage} from './account'
import PrivacyPage from './privacy'
import {GAProduct} from './config'
import {AuthDialogProvider} from './AuthDialog'
import {UserProvider} from './common/UserContext'

const history = createBrowserHistory()

history.listen(location => {
	window.gtag('event', 'page_view', {
		page_location: location.pathname + location.search,
		send_to: GAProduct,
	})
})

export default function AppRouter() {
	return (
		<UserProvider>
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
		</UserProvider>
	)
}
