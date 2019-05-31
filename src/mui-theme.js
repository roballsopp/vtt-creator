import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	typography: {
		useNextVariants: true,
	},
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
	},
});
