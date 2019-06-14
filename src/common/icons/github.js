import * as React from 'react';
import githubIcon from 'simple-icons/icons/github';
import SvgIcon from '@material-ui/core/SvgIcon';

const path = githubIcon.svg.match(/d="([^"]+)"/)[1];

export default function Github() {
	return (
		<SvgIcon>
			<path d={path} />
		</SvgIcon>
	);
}
