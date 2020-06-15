import * as React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { makeStyles } from '@material-ui/styles';
import Footer from './footer.component';
import { Editor } from './editor';
import { Splash } from './splash';
import Checkout, { CheckoutReturn } from './checkout';
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
				<main className={classes.content}>
					<Route path="/" exact component={Splash} />
					<Route path="/editor" exact component={Editor} />
					<Route path="/checkout" exact component={Checkout} />
					<Route path="/checkout-return" exact component={CheckoutReturn} />
				</main>
				<Footer />
			</Router>
		</div>
	);
}
