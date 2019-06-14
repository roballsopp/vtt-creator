import * as React from 'react';

// type UseFileSelectorOptions = {
// 	accept: string,
// 	multiple?: boolean,
// 	onFilesSelected?: (files: FileList, event: Event) => any,
// 	onFileSizeExceeded?: (files: FileList, event: Event) => any,
// 	sizeLimitMb?: number,
// };
const defaultOptions = {
	accept: '*',
};
export default function useFileSelector(inputOptions = {}) {
	const options = {
		...defaultOptions,
		...inputOptions,
	};
	const { accept, multiple, onFilesSelected, sizeLimitMb, onFileSizeExceeded } = options;

	if (!onFilesSelected) {
		throw new Error('Must provide onFilesSelected callback to useFileSelector');
	}

	const fileSelector = React.useMemo(() => {
		const el = document.createElement('input');
		el.setAttribute('type', 'file');
		return el;
	}, []);

	React.useEffect(() => {
		// don't change it if accept is falsy
		if (accept) {
			fileSelector.setAttribute('accept', accept);
		}
	}, [fileSelector, accept]);

	React.useEffect(() => {
		if (multiple) {
			fileSelector.setAttribute('multiple', 'multiple');
		} else {
			fileSelector.removeAttribute('multiple');
		}
	}, [fileSelector, multiple]);

	React.useEffect(() => {
		const onFilesChanged = e => {
			const { files } = e.target;
			if (!files || !files.length) return;

			const overSized = sizeLimitMb && Array.from(files).some(f => f.size > sizeLimitMb * 1048576);

			if (overSized) {
				onFileSizeExceeded && onFileSizeExceeded(e);
				return;
			}

			onFilesSelected(e);
		};

		fileSelector.addEventListener('change', onFilesChanged);

		return () => {
			fileSelector.removeEventListener('change', onFilesChanged);
		};
	}, [fileSelector, onFileSizeExceeded, onFilesSelected, sizeLimitMb]);

	return React.useCallback(() => {
		fileSelector.click();
	}, [fileSelector]);
}
