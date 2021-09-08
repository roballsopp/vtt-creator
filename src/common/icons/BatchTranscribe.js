import * as React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

export default React.forwardRef(function BatchTranscribe(props, ref) {
	return (
		<SvgIcon {...props} ref={ref}>
			<path d="M 4 7 H 2 v 12 c 0 1.1 0.9 2 2 2 h 15 v -2 H 4 z M 20 3 H 7 c -1.1 0 -2 0.9 -2 2 v 11 c 0 1.1 0.9 2 2 2 h 13 c 1.1 0 2 -0.9 2 -2 V 5 c 0 -1.1 -0.9 -2 -2 -2 z M 7 10 h 4 v 2 H 7 v -2 z m 7 6 H 7 v -2 h 9 v 2 z m 5 0 h -5 v -2 h 6 v 2 z m 1 -4 H 13 v -2 h 7 v 2 z" />
		</SvgIcon>
	)
})
