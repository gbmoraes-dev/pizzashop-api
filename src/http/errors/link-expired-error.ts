export class LinkExpiredError extends Error {
	constructor() {
		super('Link expired, please generate a new one.')
	}
}
