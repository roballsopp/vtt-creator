import * as React from 'react';
import throttle from 'lodash.throttle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/styles';
import { usePlayProgress } from './play-progress.context';
import { useDuration } from './duration.context';

const PLAYHEAD_RADIUS = 6;

const useStyles = makeStyles(theme => ({
	root: {
		padding: 12,
		paddingTop: 0,
		cursor: 'pointer',
	},
	playheadContainer: {
		position: 'relative',
	},
	playhead: {
		position: 'absolute',
		top: `calc(50% - ${PLAYHEAD_RADIUS}px)`,
		left: ({ playpos, progressElRef }) => {
			if (progressElRef.current) {
				const { width } = progressElRef.current.getBoundingClientRect();
				return width * playpos - PLAYHEAD_RADIUS;
			}
			return 0;
		},
		height: PLAYHEAD_RADIUS * 2,
		width: PLAYHEAD_RADIUS * 2,
		borderRadius: PLAYHEAD_RADIUS,
		backgroundColor: theme.palette.primary.main,
		cursor: 'pointer',
	},
}));

export default function PlayProgress() {
	const { currentTime, onSeek } = usePlayProgress();
	const { duration } = useDuration();
	const progress = duration && currentTime ? currentTime / duration : 0;
	const progressElRef = React.useRef();
	const [dragging, setDragging] = React.useState(false);
	const [playpos, setPlaypos] = React.useState(0);
	const classes = useStyles({ playpos, progressElRef });

	const throttledSeek = React.useCallback(throttle(onSeek, 200), [onSeek]);

	React.useEffect(() => () => throttledSeek.cancel(), [throttledSeek]);

	const getPlayposFromMouseEvent = React.useCallback(e => {
		const rect = progressElRef.current.getBoundingClientRect();
		const playpos = (e.clientX - rect.left) / rect.width;
		if (playpos > 1) return 1;
		if (playpos < 0) return 0;
		return playpos;
	}, []);

	const onClickProgressBar = React.useCallback(e => onSeek(getPlayposFromMouseEvent(e)), [
		onSeek,
		getPlayposFromMouseEvent,
	]);

	const onDownPlayhead = React.useCallback(e => {
		e.stopPropagation();
		setDragging(true);
	}, []);

	React.useEffect(() => {
		if (!dragging) setPlaypos(progress);
	}, [dragging, progress]);

	React.useEffect(() => {
		const onMouseUp = () => {
			setDragging(false);
			throttledSeek.flush();
		};
		const onMovePlayhead = e => {
			if (dragging) {
				const playpos = getPlayposFromMouseEvent(e);
				setPlaypos(playpos);
				throttledSeek(playpos);
			}
		};
		window.addEventListener('mouseup', onMouseUp);
		window.addEventListener('mousemove', onMovePlayhead);
		return () => {
			window.removeEventListener('mouseup', onMouseUp);
			window.removeEventListener('mousemove', onMovePlayhead);
		};
	}, [dragging, throttledSeek, getPlayposFromMouseEvent]);

	return (
		<div className={classes.root} onClick={onClickProgressBar}>
			<div className={classes.playheadContainer}>
				<LinearProgress ref={progressElRef} variant="determinate" value={playpos * 100} />
				<div className={classes.playhead} onMouseDown={onDownPlayhead} />
			</div>
		</div>
	);
}
