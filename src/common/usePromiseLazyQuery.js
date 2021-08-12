import React from 'react'
import {useApolloClient} from '@apollo/client'

export default function usePromiseLazyQuery(query, options) {
	const apolloClient = useApolloClient()
	const [queryState, setQueryState] = React.useState({loading: false, error: undefined, data: undefined})

	const run = React.useCallback(() => {
		setQueryState(s => ({...s, loading: true}))
		return apolloClient
			.query({
				query,
				...options,
			})
			.then(resp => {
				setQueryState(resp)
				return resp
			})
			.catch(error => {
				setQueryState(s => ({...s, loading: false, error}))
				throw error
			})
	}, [apolloClient, query, options])

	return [run, queryState]
}
