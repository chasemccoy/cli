/* eslint-disable camelcase */
import child_process from 'child_process'
import dateFunctions from 'date-fns'
import {test, assert} from '../utils/tiny-test.js'
// prettier-ignore
import { resolveHome, getFileName, clipboardToMarkdown } from '../utils/index.js'

const {format} = dateFunctions
const {execSync} = child_process

test('resolveHome', () => {
	assert(
		resolveHome('~/Desktop') === '/Users/chasemccoy/Desktop',
		'Resolves the ~ character'
	)
})

test('getFileName', () => {
	assert(
		getFileName('example file') === 'example-file',
		'Returns slug for custom title'
	)

	const name = getFileName()
	const date = format(new Date(), 'MMM-d-').toLowerCase()

	assert(name.startsWith(date), `Generates custom slug with today's date`)
})

test('clipboardToMarkdown', () => {
	execSync(`echo testing | pbcopy`)
	const clipboard = execSync(`pbpaste`)
	const result = clipboardToMarkdown(clipboard)

	assert(result === 'testing', 'Reads the clipboard contents')
})
