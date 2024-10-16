export class ProductNotAvailable extends Error {
	constructor() {
		super('Not all products are available in this restaurant.')
	}
}
