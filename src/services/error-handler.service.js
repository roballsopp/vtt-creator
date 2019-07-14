import * as Sentry from '@sentry/browser';
import { DebugMode } from '../config';

export const handleError = e => {
	Sentry.captureException(e);
	if (DebugMode) console.error(e);
};
