import * as React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './mui-theme';
import MainScreen from './main-screen.component';

function AppWrapper() {
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<MainScreen />
		</MuiThemeProvider>
	);
}

const root = document.getElementById('react-root');
if (!root) throw new Error('Could not find react dom root');
ReactDOM.render(<AppWrapper />, root);
