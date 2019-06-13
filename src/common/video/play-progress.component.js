import * as React from 'react';
import throttle from 'lodash.throttle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/styles';
import usePlayProgress from './use-play-progress.hook';
import useDuration from './use-duration.hook';
import useDragging from '../use-dragging.hook';

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
	const progressElRef = React.useRef();
	const [dragging, setDragging] = React.useState(false);
	const [playpos, setPlaypos] = React.useState(0);
	const [playheadRef, setPlayheadRef] = React.useState();
	const classes = useStyles({ playpos, progressElRef });

	const [duration, onDurationChange] = React.useState(0);
	useDuration({ onDurationChange });

	const { onSeek } = usePlayProgress({
		onTimeUpdate: React.useCallback(
			currentTime => {
				const progress = duration && currentTime ? currentTime / duration : 0;
				if (!dragging) setPlaypos(progress);
			},
			[dragging, duration]
		),
	});

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

	useDragging(playheadRef, {
		onDragStart: React.useCallback(() => setDragging(true), []),
		onDragging: React.useCallback(
			e => {
				const playpos = getPlayposFromMouseEvent(e);
				setPlaypos(playpos);
				throttledSeek(playpos);
			},
			[getPlayposFromMouseEvent, throttledSeek]
		),
		onDragEnd: React.useCallback(() => {
			throttledSeek.flush();
			setDragging(false);
		}, [throttledSeek]),
	});

	return (
		<div className={classes.root} onClick={onClickProgressBar}>
			<div className={classes.playheadContainer}>
				<LinearProgress ref={progressElRef} variant="determinate" value={playpos * 100} />
				<div ref={setPlayheadRef} className={classes.playhead} onMouseDown={e => e.stopPropagation()} />
			</div>
		</div>
	);
}
