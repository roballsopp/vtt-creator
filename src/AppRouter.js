import * as React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {Editor} from './editor'
import {Splash} from './splash'
import {AccountPage} from './account'
import PrivacyPage from './privacy'
import BatchPage from './batch'
import {GAProduct} from './config'
import {AuthDialogProvider} from './AuthDialog'
import {UserProvider} from './common/UserContext'
import NavProvider from './NavProvider'
import SideNav from './SideNav'
import TopNav from './TopNav'
import NavContent from './NavContent'

const history = createBrowserHistory()

history.listen(() => {
	window.gtag('config', GAProduct, {
		page_title: window.location.pathname,
		page_location: window.location.href,
	})
})

export default function AppRouter() {
	return (
		<UserProvider>
			<NavProvider>
				<AuthDialogProvider>
					<Router history={history}>
						<Switch>
							<Route path="/" exact>
								<Splash />
							</Route>
							<Route path="/editor" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<Editor />
								</NavContent>
							</Route>
							<Route path="/batches/:batchId/edit" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<BatchPage />
								</NavContent>
							</Route>
							<Route path="/account" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<AccountPage />
								</NavContent>
							</Route>
							<Route path="/privacy" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<PrivacyPage />
								</NavContent>
							</Route>
						</Switch>
					</Router>
				</AuthDialogProvider>
			</NavProvider>
		</UserProvider>
	)
}
