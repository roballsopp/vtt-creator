import * as React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { makeStyles } from '@material-ui/styles';
import { Editor } from './editor';
import { Splash } from './splash';
import { CheckoutCancel, CheckoutSuccess } from './checkout';
import { AccountPage, LoginRedirect, LogoutRedirect } from './account';
import { GAProduct } from './config';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	content: {
		flex: 1,
		display: 'flex',
		minHeight: 0,
		minWidth: 0,
	},
});

const history = createBrowserHistory();

history.listen(location => {
	window.gtag('config', GAProduct, { page_path: location.pathname + location.search });
});

export default function AppRouter() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Router history={history}>
				<Route path="/" exact component={Splash} />
				<Route path="/editor" exact component={Editor} />
				<Route path="/account" exact component={AccountPage} />
				<Route path="/checkout-cancel" exact component={CheckoutCancel} />
				<Route path="/checkout-success" exact component={CheckoutSuccess} />
				<Route path="/login-redirect" exact component={LoginRedirect} />
				<Route path="/logout-redirect" exact component={LogoutRedirect} />
			</Router>
		</div>
	);
}
