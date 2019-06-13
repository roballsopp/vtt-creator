import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import usePlayerDuration from '../player/use-player-duration.hook';
import AutoScrollContainer from './auto-scroll-container.component';

const useStyles = makeStyles({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
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
		minWidth: '100%',
	},
});

const ZoomContext = React.createContext({ zoomContainerRect: {} });

ZoomContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default function ZoomContainer({ children }) {
	const [pixelsPerSec] = React.useState(200);
	const [width, setWidth] = React.useState('100%');
	const classes = useStyles();

	const [zoomContainerRef, setZoomContainerRef] = React.useState();
	const [zoomContainerRect, setZoomContainerRect] = React.useState({});

	usePlayerDuration({
		onDurationChange: React.useCallback(
			duration => {
				setWidth(Number.isFinite(duration) ? Math.round(pixelsPerSec * duration) : '100%');
			},
			[pixelsPerSec]
		),
	});

	React.useLayoutEffect(() => {
		if (zoomContainerRef) {
			setZoomContainerRect(zoomContainerRef.getBoundingClientRect());
		}
	}, [zoomContainerRef, width]);

	// make sure we recalculate the rect after scrolling
	const onMouseUp = () => {
		setZoomContainerRect(zoomContainerRef.getBoundingClientRect());
	};

	const zoomContext = React.useMemo(() => ({ pixelsPerSec, zoomContainerRect }), [pixelsPerSec, zoomContainerRect]);

	return (
		<div className={classes.root}>
			<AutoScrollContainer
				horizontal
				pixelsPerSec={pixelsPerSec}
				onMouseUp={onMouseUp}
				className={classes.scrollContainer}>
				<div ref={setZoomContainerRef} className={classes.content} style={{ width }}>
					<ZoomContext.Provider value={zoomContext}>{children}</ZoomContext.Provider>
				</div>
			</AutoScrollContainer>
		</div>
	);
}

export function useZoom() {
	return React.useContext(ZoomContext);
}
