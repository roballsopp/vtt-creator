import React from 'react'
import githubIcon from 'simple-icons/icons/github'
import SvgIcon from '@material-ui/core/SvgIcon'

const path = githubIcon.svg.match(/d="([^"]+)"/)[1]

Github.propTypes = SvgIcon.propTypes

export default function Github(props) {
	return (
		<SvgIcon {...props}>
			<path d={path} />
		</SvgIcon>
	)
}
