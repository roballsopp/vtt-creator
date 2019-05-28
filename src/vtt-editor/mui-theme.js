import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	overrides: {
		MuiOutlinedInput: {
			input: {
				padding: 12,
			},
			multiline: {
				padding: 12,
			},
		},
	},
});
