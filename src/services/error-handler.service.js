import * as Sentry from '@sentry/browser'
import {DebugMode} from '../config'

export const handleError = (e, extra) => {
	Sentry.captureException(e, {extra})
	if (DebugMode) console.error(e)
}
