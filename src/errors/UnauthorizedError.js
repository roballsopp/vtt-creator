import ExtendableError from './ExtendableError';
export default class UnauthorizedError extends ExtendableError {
	constructor(m = 'Unauthorized') {
		super(m);
		this.name = 'UnauthorizedError';
	}
}
