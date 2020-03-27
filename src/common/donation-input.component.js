import * as React from 'react';
import * as PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
	donationInput: {
		fontSize: 20,
	},
});

DonationInput.propTypes = {
	value: PropTypes.number,
	onChange: PropTypes.func.isRequired,
};

export default function DonationInput({ value, onChange }) {
	const classes = useStyles();

	return (
		<TextField
			variant="outlined"
			label="Amount"
			helperText="Donation amount must be $1.00 minimum"
			value={value}
			onChange={onChange}
			InputProps={{
				startAdornment: <InputAdornment position="start">$</InputAdornment>,
				inputComponent: CustomMaskedInput,
				className: classes.donationInput,
			}}
			placeholder={'5.00'}
		/>
	);
}

const dollarsMask = input => {
	const [dollars, cents] = input.split('.');
	const mask = ['.'];
	if (dollars) {
		if (dollars.length === 1) {
			mask.unshift(/\d/);
		} else if (dollars.length === 2) {
			mask.unshift(/\d/, /\d/);
		} else {
			mask.unshift(/\d/, /\d/, /\d/);
		}
	} else {
		mask.unshift('0');
	}

	if (cents) {
		if (cents.length === 1) {
			mask.push(/\d/, '0');
		} else {
			mask.push(/\d/, /\d/);
		}
	} else {
		mask.push('0', '0');
	}

	return mask;
};

function CustomMaskedInput({ inputRef, ...props }) {
	return (
		<MaskedInput
			{...props}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={dollarsMask}
		/>
	);
}
