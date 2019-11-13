import React, {useState} from 'react'
import PropTypes from 'prop-types'
import SelectInput from 'ink-select-input'
import {Box, Text} from 'ink'
import {capitalize} from '../../utils'
import NewPost from './post'
import NewNote from './note'

const types = ['note', 'post'] // Repo? project? short url?

// this is the format that SelectInput expects
const items = types.map(item => ({
	label: capitalize(item),
	value: item
}))

/// Create a new post or note
const New = props => {
	const [selectedType, setSelectedType] = useState(null)

	const handleSelection = item => {
		setSelectedType(item.value)
	}

	return (
		<>
			{!selectedType && (
				<Box flexDirection="column">
					<Text>What would you like to create?</Text>
					<SelectInput items={items} onSelect={handleSelection} />
				</Box>
			)}
			{selectedType === 'post' && <NewPost {...props} />}
			{selectedType === 'note' && <NewNote {...props} />}
		</>
	)
}

New.propTypes = {
	/// Add the contents of the clipboard to the resulting item
	clip: PropTypes.bool,
	/// Title of the item
	title: PropTypes.string,
	/// Open the item in VS Code
	open: PropTypes.bool
}

New.defaultProps = {
	clip: false,
	title: null,
	open: false
}

New.shortFlags = {
	clip: 'c',
	title: 't',
	open: 'o'
}

export default New
