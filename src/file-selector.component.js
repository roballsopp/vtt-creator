import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

FileSelector.propTypes = {
	onFileSelected: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	accept: PropTypes.string,
};

FileSelector.defaultProps = {
	label: 'Select File',
};

export default function FileSelector(props) {
	const { onFileSelected, accept, ...buttonProps } = props;

	return (
		<React.Fragment>
			<input
				hidden
				accept={accept}
				id="raised-button-file"
				type="file"
				onChange={e => onFileSelected(e.target.files[0])}
			/>
			<label htmlFor="raised-button-file">
				<Button variant="contained" component="span" color="primary" disabled={props.disabled} {...buttonProps}>
					{props.label}
				</Button>
			</label>
		</React.Fragment>
	);
}
