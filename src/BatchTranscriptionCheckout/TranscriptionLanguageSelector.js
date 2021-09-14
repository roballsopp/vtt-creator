import React from 'react'
import * as PropTypes from 'prop-types'
import {useQuery, useMutation, gql} from '@apollo/client'
import {CircularProgress, FormControl, FormHelperText, MenuItem, Select} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {ArrowDropDown} from '@material-ui/icons'
import {useToast} from '../common'
import {handleError} from '../services/error-handler.service'
import InputLabel from '@material-ui/core/InputLabel'

const useStyles = makeStyles({
	root: {
		width: 200,
	},
})

const LANGUAGES_QUERY = gql`
	query getLanguageCodes {
		supportedLanguages {
			value
			display
		}
	}
`

TranscriptionLanguageSelector.propTypes = {
	job: PropTypes.shape({
		id: PropTypes.string.isRequired,
		language: PropTypes.string.isRequired,
	}).isRequired,
}

export default function TranscriptionLanguageSelector({job}) {
	const classes = useStyles()
	const {loading, error, data} = useQuery(LANGUAGES_QUERY)
	const toast = useToast()

	const [selectedLanguage, setSelectedLanguage] = React.useState(job.language)

	React.useEffect(() => {
		setSelectedLanguage(job.language)
	}, [job.language])

	const [mutate, {loading: settingLang}] = useMutation(
		gql`
			mutation setTranscriptionJobLanguage($jobId: String!, $language: String!) {
				setTranscriptionJobLanguage(jobId: $jobId, language: $language) {
					job {
						id
						language
					}
				}
			}
		`,
		{
			onError: err => {
				handleError(err)
				toast.error('There was a problem setting the language for this video. Please try again')
			},
		}
	)

	const supportedLanguages = loading || error ? [] : data.supportedLanguages

	const handleChangeLanguage = e => {
		setSelectedLanguage(e.target.value)
		mutate({variables: {jobId: job.id, language: e.target.value}})
	}

	function IconComponent(props) {
		if (settingLang || loading) {
			return <CircularProgress {...props} size={18} variant="indeterminate" />
		}
		return <ArrowDropDown {...props} />
	}

	return (
		<FormControl margin="dense">
			<InputLabel>Language</InputLabel>
			<Select
				value={selectedLanguage}
				onChange={handleChangeLanguage}
				disabled={settingLang || loading}
				className={classes.root}
				IconComponent={IconComponent}>
				{supportedLanguages.map(lang => (
					<MenuItem key={lang.value} value={lang.value}>
						{lang.display}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>What language is spoken in this video?</FormHelperText>
		</FormControl>
	)
}
