import os from 'os'
import fs from 'fs'
import {execSync} from 'child_process'
import {format} from 'date-fns'
import {outdent} from 'outdent'
import slugify from '@sindresorhus/slugify'
import words from 'friendly-words'

export {slugify}

const homeDirectory = os.homedir()

export const resolveHome = path => {
	return homeDirectory ? path.replace(/^~(?=$|\/|\\)/, homeDirectory) : path
}

export const writeToFile = (path, contents) => {
	fs.writeFileSync(resolveHome(path), contents)
}

export const capitalize = string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export const frontmatter = title => {
	const date = format(new Date(), 'yyyy-MM-dd')

	return outdent`
		---
		${title ? `title: ${title}\n` : ''}date: ${date}
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
	const defaultName = format(new Date(), 'MMM-d-').toLowerCase() + randomName()
	return title ? slugify(title) : defaultName
}

export const createMDXFile = (destination, options) => {
	const {title, slug = getFileName(title), open = false} = options
	const filePath = `${destination}/${slug}.mdx`
	writeToFile(filePath, frontmatter(title))

	if (open) {
		execSync(`code ${filePath}`, {stdio: 'inherit'})
	}
}
