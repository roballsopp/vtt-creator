import { ExtendableError } from '../errors';

export class EmptyFileError extends ExtendableError {
	constructor(m = 'Empty file') {
		super(m);
		this.name = 'EmptyFileError';
	}
}

export class MalformedVTTSignatureError extends ExtendableError {
	constructor(m = 'Malformed VTT Signature') {
		super(m);
		this.name = 'MalformedVTTSignatureError';
	}
}

export class MalformedVTTTimestampError extends ExtendableError {
	constructor(badTimeStamp, m = 'Malformed VTT timestamp') {
		super(m);
		this.name = 'MalformedVTTTimestampError';
		this.badTimeStamp = badTimeStamp;
	}
}
