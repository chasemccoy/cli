import {execSync} from 'child_process';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TextInput from 'ink-text-input';
import {Box, Color} from 'ink';
import {outdent} from 'outdent';
import {writeToFile} from '../../utils';

const GetNoteTitle = ({onReturn}) => {
	const [title, setTitle] = useState('');

	return (
		<Box>
			<Box marginRight={1}>Note title (optional):</Box>

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

const createNote = (destination, open) => {
	const data = outdent`
    ---
    ${formData.title ? `title: ${formData.title}\n` : ''}date: today
    ---
  `;
	writeToFile(`${destination}/note.mdx`, data);

	if (open) {
		execSync(`code ${destination}/note.mdx`, {stdio: 'inherit'});
	}
};

/// Create a new note
const NewNote = ({title, open, destination}) => {
	const [step, setStep] = useState(title ? 'success' : formSteps[0]);
	const onSuccess = () => createNote(destination, open);

	if (title) {
		formData.title = title;
		onSuccess();
	}

	return (
		<Box flexDirection="column">
			{!title && step === 'title' && (
				<GetNoteTitle
					onReturn={value => {
						formData.title = value;
						onSuccess();
						setStep('success');
					}}
				/>
			)}

			{step === 'success' && (
				<Color green>Note created at {destination}/note.mdx</Color>
			)}
		</Box>
	);
};

NewNote.propTypes = {
	/// Path of the post
	destination: PropTypes.string,
	/// Title of the post
	title: PropTypes.string,
	/// Open the post in VS Code
	open: PropTypes.bool
};

NewNote.defaultProps = {
	destination: '~/Repositories/catalog/notes',
	open: false,
	title: null
};

NewNote.shortFlags = {
	destination: 'd',
	title: 't',
	open: 'o'
};

export default NewNote;
