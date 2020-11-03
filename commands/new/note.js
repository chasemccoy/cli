import React from 'react'
import PropTypes from 'prop-types'
import {Box, Color} from 'ink'
import TextInput from '../../utils/TextInput'
import SelectFile from '../../utils/SelectFile'
import {createMDXFile, getFileName, clipboardToMarkdown} from '../../utils'
import useForm from '../../utils/useForm'

const createNote = (destination, data) => {
	const {message, title, slug, open, clip, append} = data
	const clipping = clip ? clipboardToMarkdown() : undefined
	const contents = [clipping, message].filter(Boolean).join('\n')

	createMDXFile(destination, {
		title,
		slug,
		note: true,
		contents,
		open,
		append
	})
}

/// Create a new note
const NewNote = ({title, open, destination, clip, message, append}) => {
	const initialStep = () => {
		if (append) {
			return 'selectFile'
		}

		if (title) {
			return 'submit'
		}

		return 'title'
	}

	const initialFormData = {
		step: initialStep(),
		title,
		slug: getFileName(title),
		message,
		clip,
		append,
		open
	}

	const onSubmit = data => {
		const {appendFile} = data
		const filePath = appendFile ? `${destination}/${appendFile}` : destination
		createNote(filePath, data)
	}

	const [formData, setFormData] = useForm(onSubmit, initialFormData)
	const {step} = formData

	return (
		<Box flexDirection="column">
			{!title && !append && step !== 'submit' && (
				<TextInput
					prompt="Note title:"
					focus={step === 'title'}
					onSubmit={value => {
						setFormData({
							title: value,
							slug: getFileName(value),
							step: value === '' ? 'slug' : 'submit'
						})
					}}
				/>
			)}

			{step === 'slug' && (
				<TextInput
					prompt="Note slug:"
					defaultValue={formData.slug}
					focus={step === 'slug'}
					onSubmit={value => {
						setFormData({
							slug: getFileName(value),
							step: 'submit'
						})
					}}
				/>
			)}

			{step === 'selectFile' && (
				<SelectFile
					prompt="Select a note to append to"
					directory={destination}
					focus={step === 'selectFile'}
					onSubmit={value => {
						const data = {
							appendFile: value,
							step: message ? 'submit' : 'message'
						}
						setFormData(data)
					}}
				/>
			)}

			{step === 'message' && (
				<TextInput
					prompt="Enter your note:"
					focus={step === 'message'}
					flexDirection="column"
					onSubmit={value => {
						setFormData({
							message: value,
							step: 'submit'
						})
					}}
				/>
			)}

			{step === 'submit' && (
				<Color green>
					{append
						? `Appended to ${formData.appendFile}!`
						: `Note created at ${destination}/${formData.slug}.mdx`}
				</Color>
			)}
		</Box>
	)
}

NewNote.propTypes = {
	/// Path of the note
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
