import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

export default React.forwardRef(function BatchTranslate(props, ref) {
	return (
		<SvgIcon {...props} ref={ref}>
			<path d="M 20 8 H 4 V 6 h 16 v 2 z m -2 -6 H 6 v 2 h 12 V 2 z M 4 10 H 20 c 1.1 0 2 0.9 2 2 v 8 c 0 1.1 -0.9 2 -2 2 h -16 c -1.1 0 -2 -0.9 -2 -2 v -8 c 0 -1.1 0.9 -2 2 -2 zM 12.622 17.842 l -1.524 -1.506 l 0.018 -0.018 c 1.044 -1.164 1.788 -2.502 2.226 -3.918 H 15.1 V 11.2 h -4.2 V 10 H 9.7 v 1.2 H 5.5 v 1.194 h 6.702 C 11.8 13.552 11.164 14.65 10.3 15.61 C 9.742 14.992 9.28 14.314 8.914 13.6 h -1.2 c 0.438 0.978 1.038 1.902 1.788 2.736 l -3.054 3.012 L 7.3 20.2 l 3 -3 l 1.866 1.866 l 0.456 -1.224 z M 16 14.8 h -1.2 L 12.1 22 h 1.2 l 0.672 -1.8 h 2.85 L 17.5 22 h 1.2 l -2.7 -7.2 z m -1.572 4.2 l 0.972 -2.598 L 16.372 19 h -1.944 z" />
		</SvgIcon>
	)
})
