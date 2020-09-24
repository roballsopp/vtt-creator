import * as React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import AddCreditInput from './AddCreditInput';
import { VC as VCIcon } from '../common/icons';
import { LogoutUrl, TranscriptionCost } from '../config';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minHeight: 0,
		minWidth: 0,
	},
	content: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minHeight: 0,
		minWidth: 0,
		padding: theme.spacing(2),
	},
	addCreditSection: {
		width: 400,
		padding: theme.spacing(2),
		border: `1px solid ${theme.palette.grey[300]}`,
	},
}));

AccountPage.fragments = {
	user: gql`
		fragment AccountPageUser on User {
			id
			email
			credit
			unlimitedUsage
			...AddCreditInputUser
		}
		${AddCreditInput.fragments.user}
	`,
};

AccountPage.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		credit: PropTypes.number.isRequired,
	}).isRequired,
};

export default function AccountPage({ user }) {
	const classes = useStyles();

	return (
		<main className={classes.root}>
			<AppBar position="static" color="primary">
				<Toolbar>
					<VCIcon fontSize="large" edge="start" style={{ marginRight: 8 }} />
					<Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
						VTT Creator
					</Typography>
					<Button color="secondary" variant="contained" href="/editor">
						Editor
					</Button>
				</Toolbar>
			</AppBar>
			<div className={classes.content}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">Account Email: {user.email}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6" gutterBottom>
							{user.unlimitedUsage && 'Credit: Unlimited'}
							{!user.unlimitedUsage &&
								`Credit: $${user.credit.toFixed(2)} (${(user.credit / TranscriptionCost).toFixed(1)} minutes)`}
						</Typography>
						<Typography>
							Extracting video captions automatically costs ${TranscriptionCost.toFixed(2)} per minute of video. More
							credit can be added below. Just enter how much credit you want to add, and click the button for your
							preferred payment method.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.addCreditSection}>
							<AddCreditInput user={user} />
						</div>
					</Grid>
					<Grid item xs={12}>
						<Button color="secondary" size="large" variant="contained" href={LogoutUrl}>
							Log out
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button color="secondary" size="large" variant="contained" href="/privacy">
							Privacy
						</Button>
					</Grid>
				</Grid>
			</div>
		</main>
	);
}
