import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import usePlayerDuration from '../player/use-player-duration.hook';
import AutoScrollContainer from './auto-scroll-container.component';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
		backgroundColor: theme.palette.grey['700'],
	},
	scrollContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	content: {
		height: '100%',
	},
}));

const ZoomContext = React.createContext({ pixelsPerSec: 200, zoomContainerWidth: 12000 });

ZoomContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default function ZoomContainer({ children }) {
	const classes = useStyles();
	const [pixelsPerSec] = React.useState(200);
	const { duration } = usePlayerDuration();

	// round up to next whole minute to reduce timeline re-renders
	// if we don't do something along these lines, zoomContainerWidth changes every time a new cue is added
	// since each cue uses useZoom() to get the value for pixelsPerSec, every single cue re-renders needlessly
	const zoomContainerWidth = Number.isFinite(duration)
		? Math.round(pixelsPerSec * Math.ceil(duration / 60) * 60)
		: pixelsPerSec * 60; // default to 1 minute

	const zoomContext = React.useMemo(() => ({ pixelsPerSec, zoomContainerWidth }), [pixelsPerSec, zoomContainerWidth]);

	return (
		<div className={classes.root}>
			<AutoScrollContainer horizontal pixelsPerSec={pixelsPerSec} className={classes.scrollContainer}>
				<div className={classes.content} style={{ width: zoomContainerWidth }}>
					<ZoomContext.Provider value={zoomContext}>{children}</ZoomContext.Provider>
				</div>
			</AutoScrollContainer>
		</div>
	);
}

export function useZoom() {
	return React.useContext(ZoomContext);
}
