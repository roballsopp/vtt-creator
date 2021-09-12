import React, {Suspense} from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {GAProduct} from './config'
import {AuthDialogProvider} from './AuthDialog'
import CheckAuth from './CheckAuth'
import {UserProvider} from './common/UserContext'
import PageLoader from './common/PageLoader'
import NavProvider from './NavProvider'
import SideNav from './SideNav'
import TopNav from './TopNav'
import NavContent from './NavContent'

const AccountPage = React.lazy(() => import('./account'))
const BatchTranscriptionCheckoutPage = React.lazy(() => import('./BatchTranscriptionCheckout'))
const BatchTranscriptionStatusPage = React.lazy(() => import('./BatchTranscriptionStatus'))
const Editor = React.lazy(() => import('./editor'))
const PrivacyPage = React.lazy(() => import('./privacy'))
const Splash = React.lazy(() => import('./splash'))

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
								<Suspense fallback={<PageLoader />}>
									<Splash />
								</Suspense>
							</Route>
							<Route path="/editor" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<Suspense fallback={<PageLoader />}>
										<Editor />
									</Suspense>
								</NavContent>
							</Route>
							<Route path="/batches/:batchId/edit" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<CheckAuth>
										<Suspense fallback={<PageLoader />}>
											<BatchTranscriptionCheckoutPage />
										</Suspense>
									</CheckAuth>
								</NavContent>
							</Route>
							<Route path="/batches/:batchId/status" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<CheckAuth>
										<Suspense fallback={<PageLoader />}>
											<BatchTranscriptionStatusPage />
										</Suspense>
									</CheckAuth>
								</NavContent>
							</Route>
							<Route path="/account" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<CheckAuth>
										<Suspense fallback={<PageLoader />}>
											<AccountPage />
										</Suspense>
									</CheckAuth>
								</NavContent>
							</Route>
							<Route path="/privacy" exact>
								<TopNav />
								<SideNav />
								<NavContent>
									<Suspense fallback={<PageLoader />}>
										<PrivacyPage />
									</Suspense>
								</NavContent>
							</Route>
						</Switch>
					</Router>
				</AuthDialogProvider>
			</NavProvider>
		</UserProvider>
	)
}
