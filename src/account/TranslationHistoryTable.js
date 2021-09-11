import * as React from 'react'
import PropTypes from 'prop-types'
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core'
import {TranslationHistoryTable_translationsFragment} from './TranslationHistoryTable.graphql'
import TranslationActionMenu from './TranslationActionMenu'
import JobStatusIndicator from '../common/JobStatusIndicator'

TranslationHistoryTable.fragments = {
	translations: TranslationHistoryTable_translationsFragment,
}

TranslationHistoryTable.propTypes = {
	translations: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			numCharacters: PropTypes.number.isRequired,
			cost: PropTypes.number.isRequired,
			sourceLang: PropTypes.string.isRequired,
			targetLang: PropTypes.string.isRequired,
			state: PropTypes.string.isRequired,
			createdAt: PropTypes.string.isRequired,
			updatedAt: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
}

export default function TranslationHistoryTable({translations}) {
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell padding="none">Status</TableCell>
						<TableCell align="right">Translation Cost</TableCell>
						<TableCell align="right">Number of Characters</TableCell>
						<TableCell align="center">Source Language</TableCell>
						<TableCell align="center">Target Language</TableCell>
						<TableCell align="center" padding="none">
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{translations.map(translation => {
						return (
							<TableRow key={translation.id}>
								<TableCell padding="none">
									<JobStatusIndicator job={translation} />
								</TableCell>
								<TableCell align="right">${translation.cost.toFixed(2)}</TableCell>
								<TableCell align="right">{translation.numCharacters}</TableCell>
								<TableCell align="center">{translation.sourceLang}</TableCell>
								<TableCell align="center">{translation.targetLang}</TableCell>
								<TableCell align="center" padding="none">
									<TranslationActionMenu translation={translation} />
								</TableCell>
							</TableRow>
						)
					})}
					{!translations.length && (
						<TableRow>
							<TableCell colSpan={6}>
								<Box height={100} display="flex" alignItems="center" justifyContent="center">
									<Typography align="center">Looks like you haven&apos;t translated anything yet</Typography>
								</Box>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
