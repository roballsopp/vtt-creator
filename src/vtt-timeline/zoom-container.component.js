import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDuration } from '../common/video';

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
		overflowX: 'scroll',
	},
	content: {
		height: '100%',
	},
});

const ZoomContext = React.createContext({ zoomContainerRect: {} });

ZoomContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default function ZoomContainer({ children }) {
	// in pixels per second
	const [zoom] = React.useState(200);
	const { duration } = useDuration();
	const classes = useStyles();
	const width = Number.isFinite(duration) ? Math.round(zoom * duration) : '100%';

	const [zoomContainerRef, setZoomContainerRef] = React.useState();
	// TODO: update this on screen resize and zoom
	const [zoomContainerRect, setZoomContainerRect] = React.useState({});

	React.useLayoutEffect(() => {
		if (zoomContainerRef) {
			setZoomContainerRect(zoomContainerRef.getBoundingClientRect());
		}
	}, [zoomContainerRef, width]);

	// TODO: beware of adding more renders here. Extract ZoomProvider if you do
	return (
		<div className={classes.root}>
			<div className={classes.scrollContainer}>
				<div ref={setZoomContainerRef} className={classes.content} style={{ width }}>
					<ZoomContext.Provider value={{ zoom, zoomContainerRect }}>{children}</ZoomContext.Provider>
				</div>
			</div>
		</div>
	);
}

export function useZoom() {
	return React.useContext(ZoomContext);
}
