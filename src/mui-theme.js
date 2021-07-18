import {createTheme} from '@material-ui/core/styles'

export default createTheme({
	palette: {
		// type: 'dark',
	},
	spacing: 4,
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
		MuiToolbar: {
			gutters: {
				paddingLeft: 16,
				paddingRight: 16,
				'@media (min-width: 600px)': {
					paddingLeft: 24,
					paddingRight: 24,
				},
			},
		},
		MuiTooltip: {
			tooltip: {
				fontSize: 12,
			},
		},
	},
})
