import React, {useState} from 'react'
import InkTextInput from 'ink-text-input'
import {Box} from 'ink'

const TextInput = ({
	prompt = 'Enter text:',
	onSubmit,
	defaultValue = '',
	focus = true
}) => {
	const [value, setValue] = useState(defaultValue)

	return (
		<Box>
			<Box marginRight={1}>{prompt}</Box>

			<InkTextInput
				value={value}
				focus={focus}
				onChange={value => setValue(value)}
				onSubmit={value => onSubmit(value)}
			/>
		</Box>
	)
}

export default TextInput
