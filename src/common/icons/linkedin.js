import * as React from 'react';
import linkedinIcon from 'simple-icons/icons/linkedin';
import SvgIcon from '@material-ui/core/SvgIcon';

const path = linkedinIcon.svg.match(/d="([^"]+)"/)[1];

export default function Linkedin() {
	return (
		<SvgIcon>
			<path d={path} />
		</SvgIcon>
	);
}
