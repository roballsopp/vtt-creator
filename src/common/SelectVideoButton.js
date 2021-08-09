import React from 'react'
import PropTypes from 'prop-types'
import {useFileSelector, useToast, useVideoFile} from '../common'

SelectVideoButton.propTypes = {
	element: PropTypes.element.isRequired,
	onSelected: PropTypes.func,
}

export default function SelectVideoButton({element, onSelected}) {
	const toast = useToast()
	const {onVideoFile} = useVideoFile()

	const onFilesSelected = React.useCallback(
		e => {
			const [file] = e.target.files
			onVideoFile(file)
			onSelected?.()
		},
		[onVideoFile, onSelected]
	)

	const onFileSizeExceeded = React.useCallback(() => {
		toast.error('The file you have selected is too large.')
	}, [toast])

	const openFileSelector = useFileSelector({accept: 'video/*', onFilesSelected, onFileSizeExceeded})

	return React.cloneElement(element, {
		onClick: openFileSelector,
	})
}
