import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import CheckmarkIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	icon: {
		marginRight: theme.spacing(1),
	},
	invalid: {
		color: 'red',
	},
	valid: {
		color: 'green',
	},
}));

ValidationText.propTypes = {
	children: PropTypes.string.isRequired,
	valid: PropTypes.bool,
};

export default function ValidationText({ children, valid }) {
	const classes = useStyles();

	return (
		<Typography
			className={clsx(classes.root, {
				[classes.valid]: valid === true,
				[classes.invalid]: valid === false,
			})}>
			<span className={classes.icon}>
				{valid === true && <CheckmarkIcon color="inherit" />}
				{valid === false && <CloseIcon color="inherit" />}
				{valid === undefined && <RemoveIcon color="inherit" />}
			</span>
			<span>{children}</span>
		</Typography>
	);
}
