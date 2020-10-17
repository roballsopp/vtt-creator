import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	palette: {
		// type: 'dark',
	},
	overrides: {
		MuiSnackbarContent: {
			root: {
				color: 'white',
			},
		},
		MuiAppBar: {
			colorPrimary: {
				color: 'white',
			},
		},
		MuiLinearProgress: {
			bar1Determinate: {
				transition: 'initial',
			},
		},
		MuiTooltip: {
			tooltip: {
				fontSize: 12,
			},
		},
	},
});
