import * as PropTypes from 'prop-types';

export const CuePropType = PropTypes.shape({
	startTime: PropTypes.number,
	endTime: PropTypes.number,
	text: PropTypes.string,
});
