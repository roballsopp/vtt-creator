import React from 'react'
import {useApolloClient} from '@apollo/client'

export default function usePromiseLazyQuery(query, options) {
	const apolloClient = useApolloClient()
	const [queryState, setQueryState] = React.useState({loading: false, error: undefined, data: undefined})

	// prevent changes to the query or options from creating a new instance of run
	const queryRef = React.useRef()
	queryRef.current = query

	const optionsRef = React.useRef()
	optionsRef.current = options

	const run = React.useCallback(() => {
		setQueryState(s => ({...s, loading: true}))
		return apolloClient
			.query({
				query: queryRef.current,
				...optionsRef.current,
			})
			.then(resp => {
				setQueryState(resp)
				return resp
			})
			.catch(error => {
				setQueryState(s => ({...s, loading: false, error}))
				throw error
			})
	}, [apolloClient])

	return [run, queryState]
}
