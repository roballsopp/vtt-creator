import * as React from 'react'
import * as PropTypes from 'prop-types'
import {useQuery, useMutation, gql} from '@apollo/client'
import {CircularProgress, FormControl, FormHelperText, MenuItem, Select} from '@material-ui/core'
import {ArrowDropDown} from '@material-ui/icons'
import {useToast} from '../common'
import {handleError} from '../services/error-handler.service'
import {updateBatchLanguage} from './BatchTranscriptionTable.graphql'

const LANGUAGES_QUERY = gql`
	query getLanguageCodes {
		supportedLanguages {
			value
			display
		}
	}
`

BatchLanguageSelector.propTypes = {
	batchId: PropTypes.string.isRequired,
}

export default function BatchLanguageSelector({batchId}) {
	const {loading, error, data} = useQuery(LANGUAGES_QUERY)
	const toast = useToast()

	const [selectedLanguage, setSelectedLanguage] = React.useState('')

	const [mutate, {loading: settingLang}] = useMutation(
		gql`
			mutation setTranscriptionBatchLanguage($batchId: String!, $language: String!) {
				setTranscriptionBatchLanguage(batchId: $batchId, language: $language) {
					batchId
					language
				}
			}
		`,
		{
			onError: err => {
				handleError(err)
				toast.error('There was a problem setting the language for this video. Please try again')
			},
			update(cache, {data: {setTranscriptionBatchLanguage}}) {
				const {batchId, language} = setTranscriptionBatchLanguage
				updateBatchLanguage(cache, batchId, language)
			},
		}
	)

	const supportedLanguages = loading || error ? [] : data.supportedLanguages

	const handleChangeLanguage = e => {
		setSelectedLanguage(e.target.value)
		mutate({variables: {batchId, language: e.target.value}})
	}

	function IconComponent(props) {
		if (settingLang || loading) {
			return <CircularProgress {...props} size={20} variant="indeterminate" />
		}
		return <ArrowDropDown {...props} />
	}

	const renderSelectDisplay = languageCode => {
		if (!languageCode) return 'Select batch language...'
		if (!supportedLanguages.length) return 'Select batch language...'
		return supportedLanguages.find(l => l.value === languageCode).display
	}

	return (
		<FormControl margin="normal">
			<Select
				value={selectedLanguage}
				displayEmpty
				onChange={handleChangeLanguage}
				disabled={settingLang || loading}
				renderValue={renderSelectDisplay}
				IconComponent={IconComponent}>
				{supportedLanguages.map(lang => (
					<MenuItem key={lang.value} value={lang.value}>
						{lang.display}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>Change the language of all videos in this batch</FormHelperText>
		</FormControl>
	)
}
