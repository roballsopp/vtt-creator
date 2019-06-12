import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

const AutoScrollContext = React.createContext({});

const useStyles = makeStyles({
	root: {
		height: '100%',
		overflowY: 'scroll',
		scrollBehavior: 'smooth',
	},
});

AutoScrollProvider.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export function AutoScrollProvider({ children, className }) {
	const [scrollContainerRef, setScrollContainerRef] = React.useState();
	const classes = useStyles();

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
			<div className={clsx(classes.root, className)} ref={setScrollContainerRef}>
				{children}
			</div>
		</AutoScrollContext.Provider>
	);
}

export function useAutoScroll() {
	return React.useContext(AutoScrollContext);
}
