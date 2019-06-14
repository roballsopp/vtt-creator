import * as React from 'react';
import linkedinIcon from 'simple-icons/icons/linkedin';
import SvgIcon from '@material-ui/core/SvgIcon';

const path = linkedinIcon.svg.match(/d="([^"]+)"/)[1];

Linkedin.propTypes = SvgIcon.propTypes;

export default function Linkedin(props) {
	return (
		<SvgIcon {...props}>
			<path d={path} />
		</SvgIcon>
	);
}
