import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Box, Color} from 'ink'
import {createMDXFile, getFileName} from '../../utils'
import TextInput from '../../utils/TextInput'

const formSteps = ['title', 'slug', 'success']
const formData = {}

const createPost = (destination, open) => {
	createMDXFile(destination, {
		title: formData.title,
		slug: formData.slug,
		open
	})
}

/// Create a new post
const NewPost = ({title, open, destination}) => {
	const [step, setStep] = useState(title ? 'success' : formSteps[0])
	const onSuccess = () => createPost(destination, open)

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
					prompt="Post title (optional):"
					focus={step === 'title'}
					onSubmit={value => {
						formData.title = value
						setStep('slug')
					}}
				/>
			)}

			{step === 'slug' && (
				<TextInput
					prompt="Post slug:"
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
				<Color green>
					Post created at {destination}/{formData.slug}.mdx
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
	open: PropTypes.bool
}

NewPost.defaultProps = {
	destination: '~/Repositories/catalog/posts',
	open: false,
	title: null
}

NewPost.shortFlags = {
	destination: 'd',
	title: 't',
	open: 'o'
}

export default NewPost
