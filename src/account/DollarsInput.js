import * as React from 'react'
import PropTypes from 'prop-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'

DollarsInput.propTypes = {
	defaultValue: PropTypes.string,
	error: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
}

export default function DollarsInput({defaultValue, error, onChange}) {
	const [purchaseAmt, setPurchaseAmt] = React.useState(defaultValue || '')

	const handleChange = e => {
		setPurchaseAmt(e.target.value)
	}

	const handleParseAmount = e => {
		setPurchaseAmt(e.target.value)
		onChange(e.target.value)
	}

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
			placeholder="1.00"
			margin="normal"
			helperText="Enter a number. $1.00 minimum."
			InputProps={{
				startAdornment: <InputAdornment position="start">$</InputAdornment>,
				inputProps: {min: '1'},
			}}
		/>
	)
}
