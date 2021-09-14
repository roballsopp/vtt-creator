import React from 'react'
import * as PropTypes from 'prop-types'
import download from 'downloadjs'
import {gql, useLazyQuery, useMutation} from '@apollo/client'
import {
	Box,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormHelperText,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@material-ui/core'
import {styled} from '@material-ui/styles'
import PoweredByGoogleImg from '../../../assets/translate_powered_by_google.svg'
import {handleError} from '../../services/error-handler.service'
import {useToast, Button, useCues} from '../../common'
import {ApiURL} from '../../config'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

const LANGUAGES_QUERY = gql`
	query getTranslationLanguages($search: String, $detectionSample: String!) {
		detectLanguage(text: $detectionSample) {
			languageCode
			confidence
		}
		translationLanguages {
			nodes(search: $search) {
				languageCode
				displayName
			}
		}
	}
`

const TRANSLATE_MUTATION = gql`
	mutation translate($cues: [CueInput!]!, $sourceLang: String!, $targetLang: String!) {
		translateCues(cues: $cues, sourceLang: $sourceLang, targetLang: $targetLang) {
			translation {
				translationDownloadLinkVTT
			}
			user {
				id
				credit
				creditMinutes
			}
		}
	}
`

TranslationDialog.propTypes = {
	translationCost: PropTypes.number.isRequired,
	open: PropTypes.bool,
	onRequestClose: PropTypes.func.isRequired,
}

export default function TranslationDialog({translationCost, open, onRequestClose}) {
	const {cues} = useCues()
	const [sourceLang, setSourceLang] = React.useState('')
	const [targetLang, setTargetLang] = React.useState('')
	const toast = useToast()

	const [loadLanguages, {loading: loadingLanguages, data}] = useLazyQuery(LANGUAGES_QUERY, {
		onCompleted: data => {
			if (data.detectLanguage.languageCode === 'und') return
			setSourceLang(data.detectLanguage.languageCode)
		},
		onError: err => {
			toast.error('Failed to load available translation languages.')
			handleError(err)
		},
	})

	const supportedLanguages = React.useMemo(() => data?.translationLanguages?.nodes || [], [data])
	const languageNameDict = React.useMemo(
		() => supportedLanguages.reduce((dict, l) => dict.set(l.languageCode, l.displayName), new Map()),
		[supportedLanguages]
	)

	const [translate, {loading: translatingText}] = useMutation(TRANSLATE_MUTATION)

	const handleRequestClose = React.useCallback(
		(e, reason) => {
			if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
				return
			}

			onRequestClose(e)
		},
		[onRequestClose]
	)

	const handleTranslation = async () => {
		try {
			// const text = cues.map(c => c.text)
			const cuesInput = cues.map(c => ({text: c.text, startTime: c.startTime, endTime: c.endTime}))
			const {data} = await translate({variables: {cues: cuesInput, sourceLang, targetLang}})
			const {cognitoUserPool} = await import('../../cognito')
			const cognitoUser = cognitoUserPool.getCurrentUser()

			cognitoUser.getSession((err, session) => {
				if (err) {
					return console.error(err)
				}
				const token = session.getIdToken().getJwtToken()
				const url = new URL(data.translateCues.translation.translationDownloadLinkVTT, ApiURL)
				download(`${url.href}?token=${token}`)
			})
			// const translatedCues = cues.map((c, i) => new VTTCue(c.startTime, c.endTime, data.translateText.text[i], c.id))
			// download(getVTTFromCues(translatedCues), 'translated_captions.vtt', 'text/vtt')
			toast.success('Translation successful!')
			onRequestClose()
		} catch (e) {
			handleError(e)
			toast.error('Translation failed')
		}
	}

	const handleEnteringDialog = () => {
		if (!cues?.length) return
		const detectionSample = cues[0].text?.slice(0, 50)
		loadLanguages({variables: {detectionSample}})
	}

	const renderSelectDisplay = languageCode => {
		if (loadingLanguages)
			return (
				<Box display="flex" alignItems="center">
					<Box mr={3}>
						<CircularProgress size={20} variant="indeterminate" color="inherit" />
					</Box>
					Please wait...
				</Box>
			)

		if (!languageCode) return 'Select language...'

		return `${languageNameDict.get(languageCode)} (${languageCode})`
	}

	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={handleRequestClose}
			TransitionProps={{onEntering: handleEnteringDialog}}
			aria-labelledby="translation-dialog-title">
			<Title id="translation-dialog-title" disableTypography>
				<Typography variant="h6">Translate captions</Typography>
				<img src={PoweredByGoogleImg} alt="Powered by Google" />
			</Title>
			<DialogContent>
				<Typography gutterBottom>Translation cost: (${translationCost.toFixed(2)})</Typography>
				<Typography variant="caption">
					The cost of this translation will be deducted from your credit balance only if it completes successfully.
				</Typography>
				<FormControl fullWidth margin="normal">
					<InputLabel shrink htmlFor="select-source-language" id="select-source-language-label">
						Source Language
					</InputLabel>
					<Select
						disabled={loadingLanguages}
						value={sourceLang}
						displayEmpty
						onChange={e => setSourceLang(e.target.value)}
						renderValue={renderSelectDisplay}
						labelId="select-source-language-label"
						inputProps={{
							name: 'select-source-language',
							id: 'select-source-language',
						}}>
						{supportedLanguages.map(l => (
							<MenuItem key={l.languageCode} value={l.languageCode}>
								{l.displayName} ({l.languageCode})
							</MenuItem>
						))}
					</Select>
					<FormHelperText>What language are your captions in right now?</FormHelperText>
				</FormControl>
				<FormControl fullWidth margin="normal">
					<InputLabel shrink htmlFor="select-target-language" id="select-target-language-label">
						Target Language
					</InputLabel>
					<Select
						disabled={loadingLanguages}
						value={targetLang}
						displayEmpty
						onChange={e => setTargetLang(e.target.value)}
						renderValue={renderSelectDisplay}
						labelId="select-target-language-label"
						inputProps={{
							name: 'select-target-language',
							id: 'select-target-language',
						}}>
						{supportedLanguages.map(l => (
							<MenuItem key={l.languageCode} value={l.languageCode}>
								{l.displayName} ({l.languageCode})
							</MenuItem>
						))}
					</Select>
					<FormHelperText>What language do you want to translate your captions into?</FormHelperText>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button disabled={translatingText} name="Translation Cancel" onClick={handleRequestClose} color="primary">
					Cancel
				</Button>
				<Button
					name="Translation Confirm"
					loading={loadingLanguages || translatingText}
					disabled={loadingLanguages || !sourceLang || !targetLang}
					onClick={handleTranslation}
					color="primary"
					variant="contained">
					Translate with Google
				</Button>
			</DialogActions>
		</Dialog>
	)
}
