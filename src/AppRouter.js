import React, {Suspense} from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
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

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Suspense fallback={<PageLoader />}>
				<Splash />
			</Suspense>
		),
	},
	{
		path: '/editor',
		element: (
			<React.Fragment>
				<TopNav />
				<SideNav />
				<NavContent>
					<Suspense fallback={<PageLoader />}>
						<Editor />
					</Suspense>
				</NavContent>
			</React.Fragment>
		),
	},
	{
		path: '/batches/:batchId/edit',
		element: (
			<React.Fragment>
				<TopNav />
				<SideNav />
				<NavContent>
					<CheckAuth>
						<Suspense fallback={<PageLoader />}>
							<BatchTranscriptionCheckoutPage />
						</Suspense>
					</CheckAuth>
				</NavContent>
			</React.Fragment>
		),
	},
	{
		path: '/batches/:batchId/status',
		element: (
			<React.Fragment>
				<TopNav />
				<SideNav />
				<NavContent>
					<CheckAuth>
						<Suspense fallback={<PageLoader />}>
							<BatchTranscriptionStatusPage />
						</Suspense>
					</CheckAuth>
				</NavContent>
			</React.Fragment>
		),
	},
	{
		path: '/account',
		element: (
			<React.Fragment>
				<TopNav />
				<SideNav />
				<NavContent>
					<CheckAuth>
						<Suspense fallback={<PageLoader />}>
							<AccountPage />
						</Suspense>
					</CheckAuth>
				</NavContent>
			</React.Fragment>
		),
	},
	{
		path: '/privacy',
		element: (
			<React.Fragment>
				<TopNav />
				<SideNav />
				<NavContent>
					<Suspense fallback={<PageLoader />}>
						<PrivacyPage />
					</Suspense>
				</NavContent>
			</React.Fragment>
		),
	},
])

export default function AppRouter() {
	return (
		<UserProvider>
			<NavProvider>
				<AuthDialogProvider>
					<RouterProvider router={router} fallbackElement={<PageLoader />} />
				</AuthDialogProvider>
			</NavProvider>
		</UserProvider>
	)
}
