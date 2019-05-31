import * as React from 'react';
import * as PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

IconToggle.propTypes = {
	onIcon: PropTypes.element.isRequired,
	offIcon: PropTypes.element,
	on: PropTypes.bool,
	onToggle: PropTypes.func.isRequired,
};

export default function IconToggle({ onIcon, offIcon, on, onToggle, ...buttonProps }) {
	if (on) {
		return (
			<IconButton color="inherit" {...buttonProps} onClick={onToggle}>
				{onIcon}
			</IconButton>
		);
	}

	return (
		<IconButton color="inherit" {...buttonProps} onClick={onToggle}>
			{offIcon ? offIcon : onIcon}
		</IconButton>
	);
}
