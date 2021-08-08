window.doorbellOptions = {
	id: '11145',
	appKey: 'qkEYn4twaKWlJqpJbw0Vk1nhQpRdbDd2voXXTKlNNalH4sRca0GBcej703Bs4OfC',
}
function loadDoorbell(w, d, t) {
	var hasLoaded = false
	function l() {
		if (hasLoaded) {
			return
		}
		hasLoaded = true
		window.doorbellOptions.windowLoaded = true
		var g = d.createElement(t)
		g.id = 'doorbellScript'
		g.type = 'text/javascript'
		g.async = true
		g.src = 'https://embed.doorbell.io/button/' + window.doorbellOptions['id'] + '?t=' + new Date().getTime()
		;(d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(g)
	}
	if (w.attachEvent) {
		w.attachEvent('onload', l)
	} else if (w.addEventListener) {
		w.addEventListener('load', l, false)
	} else {
		l()
	}
	if (d.readyState === 'complete') {
		l()
	}
}
const mql = window.matchMedia('(min-width: 600px)')
if (mql.matches) {
	loadDoorbell(window, document, 'script')
}
