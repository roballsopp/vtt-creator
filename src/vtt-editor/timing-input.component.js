import * as React from 'react';
import * as PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';
import { formatSeconds, parseVTTTime } from '../services/vtt.service';

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
			placeholder="00:00.000"
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
			mask={[/\d/, /\d/, ':', /[0-5]/, /\d/, '.', /\d/, /\d/, /\d/]}
			placeholderChar={'\u2000'}
			keepCharPositions
		/>
	);
}
