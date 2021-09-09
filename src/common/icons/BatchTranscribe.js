import * as React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

export default React.forwardRef(function BatchTranscribe(props, ref) {
	return (
		<SvgIcon {...props} ref={ref}>
			<path d="M 20 8 H 4 V 6 h 16 v 2 z m -2 -6 H 6 v 2 h 12 V 2 z M 20 10 H 4 c -1.1 0 -2 0.9 -2 2 v 8 c 0 1.1 0.9 2 2 2 h 16 c 1.1 0 2 -0.9 2 -2 V 12 c 0 -1.1 -0.9 -2 -2 -2 z M 4 14 h 4 v 2 H 4 v -2 z m 10 6 H 4 v -2 h 10 v 2 z m 6 0 h -4 v -2 h 4 v 2 z m 0 -4 H 10 v -2 h 10 v 2 z" />
		</SvgIcon>
	)
})
