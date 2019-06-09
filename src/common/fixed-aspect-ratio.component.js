import * as React from 'react';
import * as PropTypes from 'prop-types';

FixedAspectRatio.propTypes = {
	ratio: PropTypes.oneOf(['16:9', '4:3']).isRequired,
	children: PropTypes.node,
};

export default function FixedAspectRatio({ ratio, children }) {
	const [width, setWidth] = React.useState(0);
	const [divRef, setDivRef] = React.useState();

	React.useEffect(() => {
		const onResize = () => {
			if (divRef) {
				setWidth(getWidthFromHeightAndRatio(divRef, ratio));
			}
		};
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, [ratio, divRef]);

	React.useEffect(() => {
		if (divRef) {
			setWidth(getWidthFromHeightAndRatio(divRef, ratio));
		}
	}, [ratio, divRef]);

	return (
		<div ref={setDivRef} style={{ height: '100%', width }}>
			{children}
		</div>
	);
}

function getWidthFromHeightAndRatio(el, ratio) {
	const rect = el.getBoundingClientRect();
	switch (ratio) {
		case '16:9':
			return Math.round((16 * rect.height) / 9);
		case '4:3':
			return Math.round((4 * rect.height) / 3);
		default:
			return rect.height;
	}
}
