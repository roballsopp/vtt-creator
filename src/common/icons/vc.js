import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

VC.propTypes = SvgIcon.propTypes;

export default function VC(props) {
	return (
		<SvgIcon {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M19 4h-14c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm-13.2 5h1.7l1.5 4.5 1-4.5h1.7l-1.5 6h-2.4zm12.2 2h-1.5v-.5h-2v3h2v-.5h1.5v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
		</SvgIcon>
	);
}
