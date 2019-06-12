import * as React from 'react';
import * as PropTypes from 'prop-types';

const AutoScrollContext = React.createContext({});

AutoScrollProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function AutoScrollProvider({ children, ...props }) {
	const [scrollContainerRef, setScrollContainerRef] = React.useState();

	return (
		<AutoScrollContext.Provider
			value={React.useMemo(
				() => ({
					scrollToChild: el => {
						scrollContainerRef.scrollTop = el.offsetTop;
					},
				}),
				[scrollContainerRef]
			)}>
			<div {...props} ref={setScrollContainerRef}>
				{children}
			</div>
		</AutoScrollContext.Provider>
	);
}

export function useAutoScroll() {
	return React.useContext(AutoScrollContext);
}
