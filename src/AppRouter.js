import React, {Suspense} from 'react'
import {createBrowserRouter, RouterProvider, Navigate, Outlet} from 'react-router-dom'
import {AuthDialogProvider} from './AuthDialog'
import CheckAuth from './CheckAuth'
import {UserProvider} from './common/UserContext'
import PageLoader from './common/PageLoader'
import NavProvider from './NavProvider'
import SideNav from './SideNav'
import TopNav from './TopNav'
import NavContent from './NavContent'
import SplashDialog from './splash'

const AccountPage = React.lazy(() => import('./account'))
const BatchTranscriptionCheckoutPage = React.lazy(() => import('./BatchTranscriptionCheckout'))
const BatchTranscriptionStatusPage = React.lazy(() => import('./BatchTranscriptionStatus'))
const Editor = React.lazy(() => import('./editor'))
const PrivacyPage = React.lazy(() => import('./privacy'))

const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to="/editor" replace />,
	},
	{
		element: (
			<React.Fragment>
				<TopNav />
				<SideNav />
				<NavContent>
					<Outlet />
				</NavContent>
			</React.Fragment>
		),
		children: [
			{
				path: '/editor',
				element: (
					<Suspense fallback={<PageLoader />}>
						<Editor />
						<SplashDialog />
					</Suspense>
				),
			},
			{
				path: '/batches/:batchId/edit',
				element: (
					<CheckAuth>
						<Suspense fallback={<PageLoader />}>
							<BatchTranscriptionCheckoutPage />
						</Suspense>
					</CheckAuth>
				),
			},
			{
				path: '/batches/:batchId/status',
				element: (
					<CheckAuth>
						<Suspense fallback={<PageLoader />}>
							<BatchTranscriptionStatusPage />
						</Suspense>
					</CheckAuth>
				),
			},
			{
				path: '/account',
				element: (
					<CheckAuth>
						<Suspense fallback={<PageLoader />}>
							<AccountPage />
						</Suspense>
					</CheckAuth>
				),
			},
			{
				path: '/privacy',
				element: (
					<Suspense fallback={<PageLoader />}>
						<PrivacyPage />
					</Suspense>
				),
			},
		],
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
