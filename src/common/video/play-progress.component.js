import React from 'react';
import throttle from 'lodash/throttle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/styles';
import { usePlayTimeEvent } from './play-time-context';
import { useDuration } from './duration-context';
import useDragging from '../use-dragging.hook';
import { useVideoControl } from './video-control-context';

const PLAYHEAD_RADIUS = 6;

const useStyles = makeStyles(theme => ({
	root: {
		padding: 12,
		cursor: 'pointer',
		flex: 1,
	},
	playheadContainer: {
		position: 'relative',
	},
	playhead: {
		position: 'absolute',
		top: `calc(50% - ${PLAYHEAD_RADIUS}px)`,
		height: PLAYHEAD_RADIUS * 2,
		width: PLAYHEAD_RADIUS * 2,
		borderRadius: PLAYHEAD_RADIUS,
		backgroundColor: theme.palette.primary.main,
		cursor: 'pointer',
	},
}));

export default function PlayProgress() {
	const progressElRef = React.useRef();
	const playheadRef = React.useRef();
	const draggingRef = React.useRef(false);

	const [playpos, setPlaypos] = React.useState(0);

	const playheadPos = React.useMemo(() => {
		if (progressElRef.current) {
			const { width } = progressElRef.current.getBoundingClientRect();
			return width * playpos - PLAYHEAD_RADIUS;
		}
		return 0;
	}, [playpos]);

	const classes = useStyles();

	const { duration } = useDuration();
	const { seekVideo } = useVideoControl();

	usePlayTimeEvent(
		React.useCallback(
			currentTime => {
				const progress = duration && currentTime ? currentTime / duration : 0;
				if (!draggingRef.current) setPlaypos(progress);
			},
			[duration]
		)
	);

	const throttledSeek = React.useCallback(throttle(seekVideo, 200), [seekVideo]);

	React.useEffect(() => () => throttledSeek.cancel(), [throttledSeek]);

	const getPlayposFromMouseEvent = React.useCallback(e => {
		const rect = progressElRef.current.getBoundingClientRect();
		const playpos = (e.clientX - rect.left) / rect.width;
		if (playpos > 1) return 1;
		if (playpos < 0) return 0;
		return playpos;
	}, []);

	const onClickProgressBar = React.useCallback(
		e => {
			const playpos = getPlayposFromMouseEvent(e);
			const clipped = Math.min(Math.max(playpos, 0), 1);
			setPlaypos(clipped);
			seekVideo(clipped * duration);
		},
		[seekVideo, duration, getPlayposFromMouseEvent]
	);

	useDragging(playheadRef.current, {
		onDragStart: React.useCallback(() => {
			draggingRef.current = true;
		}, []),
		onDragging: React.useCallback(
			e => {
				const playpos = getPlayposFromMouseEvent(e);
				const clipped = Math.min(Math.max(playpos, 0), 1);
				setPlaypos(clipped);
				throttledSeek(playpos * clipped);
			},
			[getPlayposFromMouseEvent, throttledSeek]
		),
		onDragEnd: React.useCallback(() => {
			throttledSeek.flush();
			draggingRef.current = false;
		}, [throttledSeek]),
	});

	return (
		<div className={classes.root} onClick={onClickProgressBar}>
			<div className={classes.playheadContainer}>
				<LinearProgress ref={progressElRef} variant="determinate" value={playpos * 100} />
				<div
					ref={playheadRef}
					className={classes.playhead}
					style={{ left: playheadPos }}
					onMouseDown={e => e.stopPropagation()}
				/>
			</div>
		</div>
	);
}
