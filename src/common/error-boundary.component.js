import React from 'react'
import * as PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/styles'
import {handleError} from '../services/error-handler.service'

const styles = theme => ({
	root: {
		backgroundColor: theme.palette.grey[200],
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	message: {
		padding: 50,
		maxWidth: 700,
	},
})

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {error: null}
	}

	componentDidCatch(error, errorInfo) {
		this.setState({error})
		handleError(error)
		console.error(errorInfo)
	}

	render() {
		const {children, classes} = this.props
		const {error} = this.state

		if (!error) return children

		return (
			<div className={classes.root}>
				<Paper elevation={3} className={classes.message}>
					<Typography variant="h3" paragraph>
						Oh no! Something broke... :(
					</Typography>
					<Typography paragraph>
						Its possible a simple page refresh will fix the issue, so give that a shot first.
					</Typography>
					<Typography paragraph>
						VTT Creator only supports modern browsers. If you&#39;re using an older browser, try this app in the latest
						version of <Link href="https://www.google.com/chrome/">Chrome</Link>,{' '}
						<Link href="https://www.mozilla.org/en-US/firefox/new/">Firefox</Link>, or{' '}
						<Link href="https://www.microsoft.com/en-us/windows/microsoft-edge">Edge</Link>.
					</Typography>
					<Typography>
						If you&apos;re still experiencing an issue, please{' '}
						<Link href="mailto:vttcreator@gmail.com">send us an email</Link> so we can fix the problem.
					</Typography>
				</Paper>
			</div>
		)
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ErrorBoundary)
