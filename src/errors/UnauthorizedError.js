export default class UnauthorizedError {
	constructor(message, stack) {
		this.message = message;
		this.name = 'UnauthorizedError';
		this.stack = stack;
	}
}
