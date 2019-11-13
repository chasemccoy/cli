import os from 'os'
import fs from 'fs'
import {execSync} from 'child_process'
import {format} from 'date-fns'
import {outdent} from 'outdent'
import slugify from '@sindresorhus/slugify'
import words from 'friendly-words'
import glob from 'glob'

export {slugify}

const homeDirectory = os.homedir()

export const resolveHome = path => {
	return homeDirectory ? path.replace(/^~(?=$|\/|\\)/, homeDirectory) : path
}

export const writeToFile = (path, contents) => {
	fs.writeFileSync(resolveHome(path), contents)
}

export const appendToFile = (path, contents) => {
	fs.appendFileSync(resolveHome(path), contents)
}

export const capitalize = string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export const frontmatter = (title, useModified) => {
	const date = format(new Date(), 'yyyy-MM-dd')
	const dateFormat = useModified ? 'modified: ' : 'date: '

	return outdent`
		---
		${title ? `title: ${title}\n` : ''}${dateFormat}${date}
		---

		
	`
}

export const randomName = () => {
	const {predicates, objects} = words
	const predicate = predicates[Math.floor(Math.random() * predicates.length)]
	const object = objects[Math.floor(Math.random() * objects.length)]
	return `${predicate}-${object}`
}

export const getFileName = title => {
	if (title) {
		return slugify(title)
	}

	const defaultName = format(new Date(), 'MMM-d-').toLowerCase() + randomName()
	return defaultName
}

export const createMDXFile = (destination, options) => {
	const {
		title,
		slug = getFileName(title),
		open = false,
		note = false,
		contents = '',
		append = false
	} = options
	const filePath = `${destination}/${slug}.mdx`
	const content = frontmatter(title, note) + contents

	if (append) {
		appendToFile(destination, '\n\n---\n\n' + contents)
	} else {
		writeToFile(filePath, content)
	}

	if (open) {
		execSync(`code ${filePath}`, {stdio: 'inherit'})
	}
}

export const clipboardToMarkdown = () => {
	const command = `osascript -e 'try' -e 'the clipboard as "HTML"' -e 'end try' |perl -ne 'print chr foreach unpack("C*",pack("H*",substr($_,11,-3)))' | pandoc --from=html-native_divs-native_spans --to=gfm`

	const result = execSync(command).toString()

	if (!result || result.trim().length === 0) {
		return execSync(`osascript -e 'the clipboard as text'`).toString()
	}

	return result
}

export const listDirectory = (path, extension = 'mdx') => {
	const realPath = resolveHome(path)
	const pattern = `**/*.${extension}`
	const files = glob.sync(pattern, {cwd: realPath, nomount: true})
	return files
}
