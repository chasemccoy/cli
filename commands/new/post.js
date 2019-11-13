import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Box, Color} from 'ink'
import {createMDXFile, getFileName, clipboardToMarkdown} from '../../utils'
import TextInput from '../../utils/TextInput'

const formSteps = ['title', 'slug', 'success']
const formData = {}

const createPost = (destination, open, clip) => {
	createMDXFile(destination, {
		title: formData.title,
		slug: formData.slug,
		contents: clip ? clipboardToMarkdown() : undefined,
		open
	})
}

/// Create a new post
const NewPost = ({title, open, destination, clip}) => {
	const [slug, setSlug] = useState(getFileName(title))
	const [step, setStep] = useState(title ? 'success' : formSteps[0])

	const onSuccess = useCallback(() => {
		createPost(destination, open, clip)
		setStep('success')
	}, [destination, open, clip])

	const updateSlug = slug => {
		setSlug(slug)
		formData.slug = slug
	}

	useEffect(() => {
		if (title) {
			formData.title = title
			onSuccess()
		} else {
			setStep('title')
		}
	}, [onSuccess, title])

	return (
		<Box flexDirection="column">
			{!title && step !== 'success' && (
				<TextInput
					prompt="Post title (optional):"
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
					prompt="Post slug:"
					defaultValue={getFileName(formData.title)}
					focus={step === 'slug'}
					onSubmit={value => {
						updateSlug(getFileName(value))
						onSuccess()
					}}
				/>
			)}

			{step === 'success' && (
				<Color green>
					Post created at {destination}/{slug}.mdx
				</Color>
			)}
		</Box>
	)
}

NewPost.propTypes = {
	/// Path of the post
	destination: PropTypes.string,
	/// Title of the post
	title: PropTypes.string,
	/// Open the post in VS Code
	open: PropTypes.bool,
	/// Add the contents of the clipboard to the post
	clip: PropTypes.bool
}

NewPost.defaultProps = {
	destination: '~/Repositories/catalog/posts',
	open: false,
	title: null,
	clip: false
}

NewPost.shortFlags = {
	destination: 'd',
	title: 't',
	open: 'o',
	clip: 'c'
}

export default NewPost
