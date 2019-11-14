export const test = (name, fn) => {
	console.log('>', name)
	fn()
}

export const assert = (cond, desc) => {
	if (cond) {
		console.log('✔', desc)
	} else {
		console.assert(cond, desc)
		process.exit(1)
	}
}
