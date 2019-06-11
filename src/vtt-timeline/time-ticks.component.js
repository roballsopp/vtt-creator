import * as React from 'react';
import * as PropTypes from 'prop-types';
import muiGreys from '@material-ui/core/colors/grey';
import { useZoom } from './zoom-container.component';
import { formatSeconds } from '../services/vtt.service';

TimeTicks.propTypes = {
	height: PropTypes.number,
};

TimeTicks.defaultProps = {
	height: 20,
};

export default function TimeTicks({ height }) {
	// zoom is pixels/second
	const { zoom, zoomContainerRect } = useZoom();

	// one tick per second
	const numTicks = Math.ceil(zoomContainerRect.width / zoom);

	const ticks = [];

	// skip first tick
	for (let i = 1; i < numTicks; i++) {
		ticks.push(<Tick key={i} x={i * zoom} height={height} text={formatSeconds(i)} />);
	}

	return (
		<svg
			version="1.1"
			baseProfile="full"
			width={zoomContainerRect.width}
			height={height}
			xmlns="http://www.w3.org/2000/svg">
			<rect width="100%" height="100%" fill={muiGreys[600]} />
			{ticks}
		</svg>
	);
}

Tick.propTypes = {
	x: PropTypes.number.isRequired,
	height: PropTypes.number,
	text: PropTypes.string,
	fontSize: PropTypes.number,
};

Tick.defaultProps = {
	height: 20,
	fontSize: 12,
};

function Tick({ x, height, text, fontSize }) {
	const textY = (height + fontSize) / 2;
	return (
		<React.Fragment>
			<line x1={x} x2={x} y1="0" y2={height} stroke={muiGreys[300]} strokeWidth="2" />
			<text x={x + 4} y={textY} fontSize={fontSize} textAnchor="start" fill="white">
				{text}
			</text>
		</React.Fragment>
	);
}
