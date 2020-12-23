import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { useVideoControl } from '../../common/video';
import CueHandleLeft from './cue-handle-left.component';
import CueHandleRight from './cue-handle-right.component';
import CueHandleCenter from './cue-handle-center.component';
import { useZoom } from '../zoom-container.component';

const useStyles = makeStyles(theme => ({
	cue: {
		position: 'absolute',
		top: 0,
		bottom: 0,
	},
	borderHandleContainer: {
		position: 'relative',
		height: '100%',
	},
	edgeHandle: {
		position: 'absolute',
		cursor: 'ew-resize',
		width: 20,
		top: 0,
		bottom: 0,
	},
	leftHandle: {
		left: -10,
	},
	rightHandle: {
		right: -10,
	},
	centerHandle: {
		position: 'absolute',
		backgroundColor: 'white',
		cursor: 'ew-resize',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	cueContent: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		padding: 30,
		userSelect: 'none',
	},
	removeButton: {
		position: 'absolute',
		top: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

CueHandle.propTypes = {
	cue: PropTypes.shape({
		startTime: PropTypes.number.isRequired,
		endTime: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
	}).isRequired,
	cueIndex: PropTypes.number.isRequired,
	onChangeCueTiming: PropTypes.func.isRequired,
	onRemoveCue: PropTypes.func.isRequired,
};

function CueHandle({ cue, cueIndex, onChangeCueTiming, onRemoveCue }) {
	const [pos, setPos] = React.useState({ left: 0 });
	const { pixelsPerSec } = useZoom();
	const classes = useStyles();
	const { seekVideo } = useVideoControl();

	React.useEffect(() => {
		if (Number.isFinite(pixelsPerSec)) {
			const startPos = cue.startTime * pixelsPerSec;
			const width = (cue.endTime - cue.startTime) * pixelsPerSec;
			setPos({
				left: Math.round(startPos),
				width,
			});
		}
	}, [pixelsPerSec, cue.startTime, cue.endTime]);

	const onChangeLeft = React.useCallback(delta => {
		setPos(p => {
			const left = p.left + delta;
			const width = p.width - delta;
			return { left: left < 0 ? 0 : left, width };
		});
	}, []);

	const onChangeRight = React.useCallback(delta => {
		setPos(p => ({ ...p, width: p.width + delta }));
	}, []);

	const onSlideCue = React.useCallback(delta => {
		setPos(p => {
			const left = p.left + delta;

			if (left < 0) {
				return { ...p, left: 0 };
			}

			return { ...p, left };
		});
	}, []);

	const handleRemoveCue = React.useCallback(() => {
		onRemoveCue(cueIndex);
	}, [cueIndex, onRemoveCue]);

	const handleSeekToCue = () => {
		seekVideo(cue.startTime);
	};

	return (
		<div className={classes.cue} style={pos}>
			<div className={classes.borderHandleContainer}>
				<div className={classes.cueContent}>
					<Typography color="inherit" variant="h5" noWrap>
						{cue.text}
					</Typography>
				</div>
				<CueHandleCenter
					className={classes.centerHandle}
					cueIndex={cueIndex}
					onClick={handleSeekToCue}
					onDragging={onSlideCue}
					onChangeCueTiming={onChangeCueTiming}
				/>
				<CueHandleLeft
					className={clsx(classes.edgeHandle, classes.leftHandle)}
					cueIndex={cueIndex}
					onDragging={onChangeLeft}
					onChangeCueTiming={onChangeCueTiming}
				/>
				<CueHandleRight
					className={clsx(classes.edgeHandle, classes.rightHandle)}
					cueIndex={cueIndex}
					onDragging={onChangeRight}
					onChangeCueTiming={onChangeCueTiming}
				/>
				<Tooltip title="Delete Cue">
					<div className={classes.removeButton}>
						<IconButton aria-label="Delete" onClick={handleRemoveCue} size="small" edge="end" color="inherit">
							<CloseIcon fontSize="small" color="inherit" />
						</IconButton>
					</div>
				</Tooltip>
			</div>
		</div>
	);
}

export default React.memo(CueHandle);
