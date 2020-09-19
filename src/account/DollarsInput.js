import * as React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

DollarsInput.propTypes = {
	onChange: PropTypes.func.isRequired,
};

export default function DollarsInput({ onChange }) {
	const [purchaseAmt, setPurchaseAmt] = React.useState('');
	const [error, setError] = React.useState(false);

	const handleChange = e => {
		setPurchaseAmt(e.target.value);
	};

	const handleParseAmount = e => {
		if (!e.target.value) return;
		const num = Number(e.target.value);
		if (Number.isNaN(num)) {
			setError(true);
		} else {
			setPurchaseAmt(num.toFixed(2));
			onChange(num.toFixed(2));
		}
	};

	return (
		<TextField
			variant="outlined"
			fullWidth
			error={error}
			type="number"
			label="Amount to Add"
			value={purchaseAmt}
			onChange={handleChange}
			onBlur={handleParseAmount}
			placeholder="0.00"
			margin="normal"
			helperText="Please type a number"
			InputProps={{
				startAdornment: <InputAdornment position="start">$</InputAdornment>,
			}}
		/>
	);
}
