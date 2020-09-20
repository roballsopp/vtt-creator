import React from 'react';
import { useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { TranscriptionCost } from '../config';
import { useDuration } from './video';

const CreditContext = React.createContext({
	cost: 0,
	credit: 0,
});

const USER_QUERY = gql`
	query getUser {
		self {
			id
			credit
		}
	}
`;

CreditProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function CreditProvider({ children }) {
	const { duration } = useDuration();
	// round up to next whole cent
	const cost = Math.ceil((duration / 60) * TranscriptionCost * 100) / 100;
	const { loading, error, data } = useQuery(USER_QUERY);
	const credit = loading || error || !data ? 0 : data.self.credit;

	return (
		<CreditContext.Provider
			value={React.useMemo(
				() => ({
					cost,
					credit,
				}),
				[cost, credit]
			)}>
			{children}
		</CreditContext.Provider>
	);
}

export function useCredit() {
	return React.useContext(CreditContext);
}
