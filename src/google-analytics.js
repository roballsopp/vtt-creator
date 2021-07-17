import {GAProduct} from './config'

window.dataLayer = window.dataLayer || []

function gtag() {
	if (GAProduct) window.dataLayer.push(arguments)
}

window.gtag = gtag

if (GAProduct) {
	const script = document.createElement('script')
	const head = document.getElementsByTagName('head')[0]
	script.async = 1
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GAProduct}`
	head.appendChild(script)

	gtag('js', new Date())
	gtag('config', GAProduct)
}
