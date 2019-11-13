import React, {useState} from 'react'
import InkTextInput from 'ink-text-input'
import {Box, Color} from 'ink'

const TextInput = ({
	prompt = 'Enter text:',
	onSubmit,
	defaultValue = '',
	focus = true,
	...rest
}) => {
	const [value, setValue] = useState(defaultValue)

	return (
		<Box {...rest}>
			<Box marginRight={1}>
				<Color green>{prompt}</Color>
			</Box>

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
