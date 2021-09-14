import React from 'react'
import * as PropTypes from 'prop-types'
import {useQuery, gql} from '@apollo/client'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

const LANGUAGES_QUERY = gql`
	query getLanguageCodes {
		supportedLanguages {
			value
			display
		}
	}
`

LanguageSelector.propTypes = {
	value: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
}

export default function LanguageSelector({value, disabled, onChange}) {
	const {loading, error, data} = useQuery(LANGUAGES_QUERY)

	const supportedLanguages = loading || error ? [] : data.supportedLanguages

	return (
		<FormControl margin="normal" disabled={disabled}>
			<InputLabel htmlFor="select-language">Language</InputLabel>
			<Select
				value={value}
				onChange={e => onChange(e.target.value)}
				inputProps={{
					name: 'select-language',
					id: 'select-language',
				}}>
				{supportedLanguages.map(lang => (
					<MenuItem key={lang.value} value={lang.value}>
						{lang.display}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>In what language is the video content spoken?</FormHelperText>
		</FormControl>
	)
}
