const AUTH_TOKEN_KEY = 'vtt-creator-auth-token';
const AUTH_TOKEN_EXPIRATION_KEY = 'vtt-creator-auth-token-expiration';

export function setAuthToken(token) {
	localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
	return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthTokenExpiration(expiresAt) {
	localStorage.setItem(AUTH_TOKEN_EXPIRATION_KEY, expiresAt.toISOString());
}

export function getAuthTokenExpiration() {
	const dateStr = localStorage.getItem(AUTH_TOKEN_EXPIRATION_KEY);
	if (dateStr) return new Date(dateStr);
	return null;
}

export function clearAuth() {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_TOKEN_EXPIRATION_KEY);
}

export function listenForAuth(callback) {
	let hasToken = false;
	let hasExpiration = false;

	const handleStorageChange = e => {
		if (e.key === AUTH_TOKEN_KEY) {
			hasToken = true;
		}

		if (e.key === AUTH_TOKEN_EXPIRATION_KEY) {
			hasExpiration = true;
		}

		if (hasToken && hasExpiration) {
			callback();
			hasToken = false;
			hasExpiration = false;
		}
	};

	window.addEventListener('storage', handleStorageChange);

	// stop listening
	return () => {
		window.removeEventListener('storage', handleStorageChange);
	};
}
