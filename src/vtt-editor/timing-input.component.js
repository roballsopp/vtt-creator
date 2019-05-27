import * as React from 'react';
import * as PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';

TimingInput.propTypes = {
	value: PropTypes.number,
	onChange: PropTypes.func.isRequired,
};

export default function TimingInput({ value, onChange, ...props }) {
	const [vttTime, setVttTime] = React.useState(() => formatSeconds(value));
	// if a new value comes in prop props, it takes precedence
	React.useEffect(() => {
		setVttTime(formatSeconds(value));
	}, [value]);

	return (
		<TextField
			{...props}
			value={vttTime}
			onBlur={e => {
				e.target.value = parseVTTTime(e.target.value);
				onChange(e);
			}}
			InputProps={{ inputComponent: CustomMaskedInput }}
			placeholder="00:00:000"
		/>
	);
}

CustomMaskedInput.propTypes = {
	inputRef: PropTypes.func.isRequired,
};

function CustomMaskedInput({ inputRef, ...props }) {
	return (
		<MaskedInput
			{...props}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={[/\d/, /\d/, ':', /[0-5]/, /\d/, ':', /\d/, /\d/, /\d/]}
			placeholderChar={'\u2000'}
			keepCharPositions
		/>
	);
}

// decSeconds is a float version of the time in seconds (e.g. 13.456)
function formatSeconds(decSeconds) {
	if (isNaN(decSeconds)) return '00:00:000';
	const min = Math.floor(decSeconds / 60);
	const sec = Math.floor(decSeconds % 60);
	const mill = Math.round((decSeconds - Math.floor(decSeconds)) * 1000);
	return `${formatTimeUnit(min, 2)}:${formatTimeUnit(sec, 2)}:${formatTimeUnit(mill, 3)}`;
}

function formatTimeUnit(unit, width) {
	if (!unit) return '0'.repeat(width);
	return unit.toString().padStart(width, '0');
}

function parseVTTTime(formattedTime) {
	const [min10, min1, sep1, sec10, sec1, sep2, mill10, mill100, mill1000] = formattedTime.split(''); // eslint-disable-line no-unused-vars

	return (
		parseTimeUnit(min10) * 10 * 60 +
		parseTimeUnit(min1) * 60 +
		parseTimeUnit(sec10) * 10 +
		parseTimeUnit(sec1) +
		parseTimeUnit(mill10) / 10 +
		parseTimeUnit(mill100) / 100 +
		parseTimeUnit(mill1000) / 1000
	);
}

function parseTimeUnit(unit) {
	const parsed = parseInt(unit);
	return isNaN(parsed) ? 0 : parsed;
}
