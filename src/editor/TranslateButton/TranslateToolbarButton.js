import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from '@material-ui/core'
import TranslateIcon from '@material-ui/icons/Translate'
import {useTranslate} from './translation-context'
import {useCues, Button} from '../../common'

TranslateToolbarButton.propTypes = {
	className: PropTypes.any,
}

export default function TranslateToolbarButton(props) {
	const {handleTranslationDialogOpen, loading} = useTranslate()
	const {cues} = useCues()

	const tooltipText = getTooltipText(loading, cues)

	if (tooltipText) {
		return (
			<Tooltip title={tooltipText}>
				<span className={props.className}>
					<Button {...props} disabled>
						<TranslateIcon />
					</Button>
				</span>
			</Tooltip>
		)
	}

	return (
		<Button {...props} name="translate toolbar button" onClick={handleTranslationDialogOpen}>
			<Tooltip title="Translate captions">
				<TranslateIcon />
			</Tooltip>
		</Button>
	)
}

function getTooltipText(loading, cues) {
	if (loading) return 'Please wait...'
	if (!cues.length) return 'Add some captions below, then you can translate them.'
	const charCount = cues.reduce((cnt, c) => cnt + c.text.length, 0)
	if (!charCount) return 'Add some text to your captions to translate.'
}
