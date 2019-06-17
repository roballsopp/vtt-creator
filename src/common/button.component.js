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
};

export default function Button(props) {
	const { children, icon, loading, ...buttonProps } = props;
	const classes = useStyles();

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
			<MuiButton {...buttonProps}>
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

	return <MuiButton {...buttonProps}>{children}</MuiButton>;
}
