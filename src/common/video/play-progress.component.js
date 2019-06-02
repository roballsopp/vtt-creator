import * as React from 'react';
import * as PropType from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';

PlayProgress.propTypes = {
	value: PropType.number,
	onSeek: PropType.func.isRequired,
};

export default function PlayProgress({ value, onSeek }) {
	const progressElRef = React.useRef();
	const onClickProgressBar = e => {
		const rect = progressElRef.current.getBoundingClientRect();
		onSeek((e.clientX - rect.left) / rect.width);
	};

	return <LinearProgress ref={progressElRef} variant="determinate" value={value} onClick={onClickProgressBar} />;
}
