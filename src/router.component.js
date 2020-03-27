import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Footer from './footer.component';
import { Editor } from './editor';
import { Splash } from './splash';

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

export default function AppRouter() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<main className={classes.content}>
				<Router>
					<Route path="/" exact component={Splash} />
					<Route path="/editor" exact component={Editor} />
				</Router>
			</main>
			<Footer />
		</div>
	);
}
