import * as React from 'react';
import * as PropTypes from 'prop-types';
import MuiButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
	loaderRoot: {
		margin: -4,
		marginRight: 4,
	},
});

Button.propTypes = {
	...MuiButton.propTypes,
	loading: PropTypes.bool,
	icon: PropTypes.node,
	onClick: PropTypes.func,
	name: PropTypes.string,
};

export default function Button(props) {
	const { children, icon, loading, name, onClick, ...buttonProps } = props;
	const classes = useStyles();

	const handleClick = (...args) => {
		if (onClick) onClick(...args);
		window.gtag('event', name, {
			event_category: 'button_click',
		});
	};

	if (loading) {
		return (
			<MuiButton {...buttonProps} disabled>
				<CircularProgress size={20} variant="indeterminate" color="inherit" className={classes.loaderRoot} />
				{children}
			</MuiButton>
		);
	}

	if (icon) {
		return (
			<MuiButton onClick={handleClick} {...buttonProps}>
				{React.cloneElement(icon, {
					fontSize: 'small',
					style: {
						margin: -4,
						marginRight: 4,
					},
				})}
				{children}
			</MuiButton>
		);
	}

	return (
		<MuiButton onClick={handleClick} {...buttonProps}>
			{children}
		</MuiButton>
	);
}
