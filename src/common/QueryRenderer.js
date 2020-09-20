import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/styles';
import Loader from './loader.component';
import { UnauthorizedError } from '../errors';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minHeight: 0,
		minWidth: 0,
	},
}));

QueryRenderer.propTypes = {
	render: PropTypes.func.isRequired,
	query: PropTypes.object.isRequired,
	options: PropTypes.shape({
		variables: PropTypes.object,
		fetchPolicy: PropTypes.oneOf([
			'cache-first',
			'network-only',
			'cache-only',
			'no-cache',
			'standby',
			'cache-and-network',
		]),
		errorPolicy: PropTypes.oneOf(['none', 'ignore', 'all']),
		onCompleted: PropTypes.func,
		onError: PropTypes.func,
	}),
};

export default function QueryRenderer({ render, query, options }) {
	const classes = useStyles();
	const { loading, error, data, refetch, fetchMore, called } = useQuery(query, options);

	if (loading) {
		return (
			<main className={classes.root}>
				<Loader />
			</main>
		);
	}

	if (error && error.networkError) {
		if (error.networkError.statusCode === 401) {
			throw new UnauthorizedError(error.networkError.message);
		}
		if (error.networkError instanceof UnauthorizedError) {
			throw error.networkError;
		}
	}

	if (error) {
		return <main className={classes.root}>Eek!</main>;
	}

	return render({ data, refetch, fetchMore, called });
}
