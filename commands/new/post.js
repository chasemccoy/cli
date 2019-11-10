import {execSync} from 'child_process';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TextInput from 'ink-text-input';
import {Box, Color} from 'ink';
import {outdent} from 'outdent';
import {writeToFile} from '../../utils';

const GetPostTitle = ({onReturn}) => {
	const [title, setTitle] = useState('');

	return (
		<Box>
			<Box marginRight={1}>Post title (optional):</Box>

			<TextInput
				value={title}
				onChange={value => setTitle(value)}
				onSubmit={value => onReturn(value)}
			/>
		</Box>
	);
};

const formSteps = ['title', 'success'];
const formData = {};

const createPost = (destination, open) => {
	const data = outdent`
    ---
    ${formData.title ? `title: ${formData.title}\n` : ''}date: today
    ---
  `;
	writeToFile(`${destination}/post.mdx`, data);

	if (open) {
		execSync(`code ${destination}/post.mdx`, {stdio: 'inherit'});
	}
};

/// Create a new post
const NewPost = ({title, open, destination}) => {
	const [step, setStep] = useState(title ? 'success' : formSteps[0]);
	const onSuccess = () => createPost(destination, open);

	if (title) {
		formData.title = title;
		onSuccess();
	}

	return (
		<Box flexDirection="column">
			{!title && step === 'title' && (
				<GetPostTitle
					onReturn={value => {
						formData.title = value;
						onSuccess();
						setStep('success');
					}}
				/>
			)}

			{step === 'success' && (
				<Color green>Post created at {destination}/post.mdx</Color>
			)}
		</Box>
	);
};

NewPost.propTypes = {
	/// Path of the post
	destination: PropTypes.string,
	/// Title of the post
	title: PropTypes.string,
	/// Open the post in VS Code
	open: PropTypes.bool
};

NewPost.defaultProps = {
	destination: '~/Repositories/catalog/posts',
	open: false,
	title: null
};

NewPost.shortFlags = {
	destination: 'd',
	title: 't',
	open: 'o'
};

export default NewPost;
