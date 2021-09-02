import React from 'react'

export function useOffsetPagination(initialPage, initialPageSize) {
	const [limit, setLimit] = React.useState(initialPageSize)
	const [page, setPage] = React.useState(initialPage)

	const offset = page * limit

	const handleChangePage = React.useCallback((event, newPage) => {
		setPage(newPage)
	}, [])

	const handleChangeRowsPerPage = React.useCallback(e => {
		setLimit(Number(e.target.value))
		setPage(0)
	}, [])

	return {
		offset,
		limit,
		page,
		paginatorProps: {
			rowsPerPageOptions: [10], // disable page size selection until we can figure out the bug with this
			rowsPerPage: limit,
			page,
			onPageChange: handleChangePage,
			onRowsPerPageChange: handleChangeRowsPerPage,
		},
	}
}

export function useSlicePage(list, loading, offset, limit) {
	const previousSlice = React.useRef([])

	return React.useMemo(() => {
		if (loading) return previousSlice.current
		previousSlice.current = (list || []).slice(offset, offset + limit)
		return previousSlice.current
	}, [list, loading, offset, limit])
}
