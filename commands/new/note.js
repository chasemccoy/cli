import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Box, Color} from 'ink'
import TextInput from '../../utils/TextInput'
import {createMDXFile, getFileName} from '../../utils'

const formSteps = ['title', 'slug', 'success']
const formData = {}

const createNote = (destination, open) => {
	createMDXFile(destination, {
		title: formData.title,
		slug: formData.slug,
		open
	})
}

/// Create a new note
const NewNote = ({title, open, destination}) => {
	const [step, setStep] = useState(title ? 'success' : formSteps[0])
	const onSuccess = () => createNote(destination, open)

	useEffect(() => {
		if (title) {
			formData.title = title
			setStep('slug')
		}
	}, [title])

	return (
		<Box flexDirection="column">
			{!title && step !== 'success' && (
				<TextInput
					prompt="Note title:"
					focus={step === 'title'}
					onSubmit={value => {
						formData.title = value
						setStep('slug')
					}}
				/>
			)}

			{step === 'slug' && (
				<TextInput
					prompt="Note slug:"
					defaultValue={getFileName(formData.title)}
					focus={step === 'slug'}
					onSubmit={value => {
						formData.slug = value
						onSuccess()
						setStep('success')
					}}
				/>
			)}

			{step === 'success' && (
				<Color green>Note created at {destination}/note.mdx</Color>
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
	open: PropTypes.bool
}

NewNote.defaultProps = {
	destination: '~/Repositories/catalog/notes',
	open: false,
	title: null
}

NewNote.shortFlags = {
	destination: 'd',
	title: 't',
	open: 'o'
}

export default NewNote
