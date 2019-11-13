import React from 'react'
import SelectInput from 'ink-select-input'
import {Text, Box} from 'ink'
import {listDirectory} from '.'

const SelectFile = ({
	prompt = 'Select a file',
	directory,
	onSubmit,
	focus = true
}) => {
	const files = listDirectory(directory)
	const items = files.map(file => ({
		label: file,
		value: file
	}))

	return (
		<Box flexDirection="column">
			<Text>{prompt}</Text>
			<SelectInput
				items={items}
				focus={focus}
				limit={10}
				onSelect={item => onSubmit(item.value)}
			/>
		</Box>
	)
}

export default SelectFile
