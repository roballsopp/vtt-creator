import React from 'react'
import EventEmitter from 'events'
import PropTypes from 'prop-types'

const NavContext = React.createContext({
	sideNavOpen: false,
	setSideNavOpen: () => {},
})

NavProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export default function NavProvider({children}) {
	const [sideNavOpen, setSideNavOpen] = React.useState()
	const sideNavEvents = React.useMemo(() => new EventEmitter(), [])

	return (
		<NavContext.Provider
			value={React.useMemo(
				() => ({
					sideNavOpen,
					sideNavEvents,
					setSideNavOpen,
				}),
				[sideNavOpen, sideNavEvents]
			)}>
			{children}
		</NavContext.Provider>
	)
}

export const useSideNav = () => React.useContext(NavContext)

export const SIDE_NAV_WIDTH = 250
