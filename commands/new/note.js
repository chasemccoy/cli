import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Box, Color} from 'ink'
import TextInput from '../../utils/TextInput'
import SelectFile from '../../utils/SelectFile'
import {createMDXFile, getFileName, clipboardToMarkdown} from '../../utils'

const formSteps = ['title', 'slug', 'selectFile', 'message', 'success']
const formData = {}

const createNote = (destination, open, clip, append) => {
	const clipping = clip ? clipboardToMarkdown() : undefined
	const {message} = formData
	const contents = [clipping, message].filter(Boolean).join('\n')

	createMDXFile(destination, {
		title: formData.title,
		slug: formData.slug,
		note: true,
		contents,
		open,
		append
	})
}

/// Create a new note
const NewNote = ({title, open, destination, clip, message, append}) => {
	const [slug, setSlug] = useState(getFileName(title))
	const [appendFile, setAppendFile] = useState(null)
	const [step, setStep] = useState(title ? 'success' : formSteps[0])

	const onSuccess = useCallback(
		(appendToFile = appendFile) => {
			const filePath = appendToFile
				? `${destination}/${appendToFile}`
				: destination
			createNote(filePath, open, clip, append)
			setStep('success')
		},
		[appendFile, destination, open, clip, append]
	)

	const updateSlug = slug => {
		setSlug(slug)
		formData.slug = slug
	}

	useEffect(() => {
		formData.message = message

		if (append) {
			setStep('selectFile')
		} else if (title) {
			formData.title = title
			formData.slug = slug
			onSuccess()
		} else {
			setStep('title')
		}
	}, [title, message, append, slug, onSuccess])

	return (
		<Box flexDirection="column">
			{!title && !append && step !== 'success' && (
				<TextInput
					prompt="Note title:"
					focus={step === 'title'}
					onSubmit={value => {
						formData.title = value
						updateSlug(getFileName(value))
						if (value === '') {
							setStep('slug')
						} else {
							onSuccess()
						}
					}}
				/>
			)}

			{step === 'slug' && (
				<TextInput
					prompt="Note slug:"
					defaultValue={slug}
					focus={step === 'slug'}
					onSubmit={value => {
						updateSlug(getFileName(value))
						onSuccess()
					}}
				/>
			)}

			{step === 'selectFile' && (
				<SelectFile
					prompt="Select a note to append to"
					directory={destination}
					focus={step === 'selectFile'}
					onSubmit={value => {
						setAppendFile(value)
						if (!message) {
							setStep('message')
						} else {
							onSuccess(value)
						}
					}}
				/>
			)}

			{step === 'message' && (
				<TextInput
					prompt="Enter your note:"
					focus={step === 'message'}
					flexDirection="column"
					onSubmit={value => {
						formData.message = value
						onSuccess()
					}}
				/>
			)}

			{step === 'success' && (
				<Color green>
					{append
						? `Appended to ${appendFile}!`
						: `Note created at ${destination}/${slug}.mdx`}
				</Color>
			)}
		</Box>
	)
}

NewNote.propTypes = {
	/// Path of the post
	destination: PropTypes.string,
	/// Title of the post
	title: PropTypes.string,
	/// Open the post in VS Code
	open: PropTypes.bool,
	/// Add the contents of the clipboard to the note
	clip: PropTypes.bool,
	message: PropTypes.string,
	append: PropTypes.bool
}

NewNote.defaultProps = {
	destination: '~/Repositories/catalog/notes',
	open: false,
	title: null,
	clip: false,
	message: null,
	append: false
}

NewNote.shortFlags = {
	destination: 'd',
	title: 't',
	open: 'o',
	clip: 'c',
	message: 'm',
	append: 'a'
}

export default NewNote
