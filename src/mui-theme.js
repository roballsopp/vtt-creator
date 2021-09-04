import {createTheme, responsiveFontSizes} from '@material-ui/core/styles'

export default responsiveFontSizes(
	createTheme({
		palette: {
			// type: 'dark',
		},
		typography: {
			subtitle1: {
				fontWeight: 500,
			},
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
)
