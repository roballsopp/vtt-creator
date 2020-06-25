import { PayPalClientID, DebugMode } from './config';

if (PayPalClientID) {
	const script = document.createElement('script');
	const head = document.getElementsByTagName('head')[0];
	script.src = `https://www.paypal.com/sdk/js?client-id=${PayPalClientID}&debug=${DebugMode}`;
	head.appendChild(script);
}
