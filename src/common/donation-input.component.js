import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
	donationInput: {
		fontSize: 20,
	},
});

DonationInput.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export default function DonationInput({ value, onChange, ...otherProps }) {
	const classes = useStyles();
	const numericValue = Number(value);
	const error = !Number.isFinite(numericValue);

	function handleChange(e) {
		onChange(e.target.value);
	}

	function handleBlur(e) {
		if (!error) onChange(Number(e.target.value).toFixed(2));
	}

	return (
		<TextField
			fullWidth
			variant="outlined"
			label="Amount"
			placeholder="5.00"
			{...otherProps}
			error={error}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			InputProps={{
				startAdornment: <InputAdornment position="start">$</InputAdornment>,
				className: classes.donationInput,
			}}
		/>
	);
}
