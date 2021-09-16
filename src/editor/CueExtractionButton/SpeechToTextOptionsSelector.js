import React from 'react'
import * as PropTypes from 'prop-types'
import {Box, FormControl, FormControlLabel, Radio, RadioGroup, Tooltip, Typography} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Help'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import {gql, useQuery} from '@apollo/client'

const LANGUAGES_QUERY = gql`
	query getLanguageCodes {
		supportedLanguages {
			value
			display
			supportedModels
		}
	}
`

const DEFAULT_LANG = {
	value: 'en-US',
	display: 'English (United States)',
	supportedModels: ['DEFAULT', 'PHONE_CALL', 'VIDEO'],
}

SpeechToTextOptionsSelector.propTypes = {
	languageCode: PropTypes.string.isRequired,
	speechModel: PropTypes.string.isRequired,
	onChangeLanguageCode: PropTypes.func.isRequired,
	onChangeSpeechModel: PropTypes.func.isRequired,
}

export default function SpeechToTextOptionsSelector({
	languageCode,
	speechModel,
	onChangeLanguageCode,
	onChangeSpeechModel,
}) {
	const [language, setLanguage] = React.useState(DEFAULT_LANG)

	const {loading, error, data} = useQuery(LANGUAGES_QUERY, {
		onCompleted: data => {
			setLanguage(data.supportedLanguages.find(l => l.value === languageCode))
		},
	})

	const supportedLanguages = loading || error ? [DEFAULT_LANG] : data.supportedLanguages

	const handleChangeLanguageCode = e => {
		onChangeLanguageCode(e.target.value)
		const selectedLanguage = supportedLanguages.find(l => l.value === e.target.value)
		if (!selectedLanguage.supportedModels.includes(speechModel)) {
			onChangeSpeechModel('DEFAULT')
		}
		setLanguage(selectedLanguage)
	}

	const handleChangeSpeechModel = e => {
		onChangeSpeechModel(e.target.value)
	}

	return (
		<React.Fragment>
			<FormControl margin="normal" disabled={loading}>
				<InputLabel htmlFor="select-language">Language</InputLabel>
				<Select
					value={languageCode}
					onChange={handleChangeLanguageCode}
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
			<FormControl component="fieldset" fullWidth margin="normal" disabled={loading}>
				<Typography variant="caption" color="textSecondary">
					Speech to Text Model
				</Typography>
				<RadioGroup aria-label="speechModel" name="speechModel" value={speechModel} onChange={handleChangeSpeechModel}>
					<FormControlLabel value="DEFAULT" control={<Radio />} label="Default" />
					<FormControlLabel
						disabled={!language.supportedModels.includes('VIDEO')}
						value="VIDEO"
						control={<Radio />}
						label={
							<Box display="flex" alignItems="center">
								<Typography>This video has multiple speakers</Typography>
								<Tooltip title="This option seems to work well for Zoom/Video conferencing calls">
									<InfoIcon fontSize="small" style={{marginLeft: 8}} />
								</Tooltip>
							</Box>
						}
					/>
					<FormControlLabel
						disabled={!language.supportedModels.includes('PHONE_CALL')}
						value="PHONE_CALL"
						control={<Radio />}
						label={
							<Box display="flex" alignItems="center">
								<Typography>This video is a recorded phone call</Typography>
								<Tooltip title="Choose this for very low bit rate audio, like you would hear through a phone speaker">
									<InfoIcon fontSize="small" style={{marginLeft: 8}} />
								</Tooltip>
							</Box>
						}
					/>
				</RadioGroup>
			</FormControl>
		</React.Fragment>
	)
}
