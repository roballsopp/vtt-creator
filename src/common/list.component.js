import * as React from 'react'
import * as PropTypes from 'prop-types'

List.propTypes = {
	data: PropTypes.array,
	renderItem: PropTypes.func.isRequired,
	getKey: PropTypes.func,
	element: PropTypes.oneOf(['div', 'span']).isRequired,
}

List.defaultProps = {
	getKey: (item, i) => i,
	element: 'div',
}

export default function List({data, renderItem, getKey, element, ...props}) {
	// TODO: show empty state here
	if (!data) return null
	return React.createElement(
		element,
		props,
		data.map((item, i) => {
			const isLast = data.length - 1 === i
			return React.cloneElement(renderItem(item, i, isLast), {key: getKey(item, i)})
		})
	)
}
