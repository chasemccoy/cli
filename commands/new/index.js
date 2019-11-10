import React, {useState} from 'react';
import SelectInput from 'ink-select-input';
import {Box, Text} from 'ink';
import {capitalize} from '../../utils';
import NewPost from './post';
import NewNote from './note';

const types = ['note', 'post']; // Repo? project? short url?

// this is the format that SelectInput expects
const items = types.map(item => ({
	label: capitalize(item),
	value: item
}));

/// Create a new post or note
const New = () => {
	const [selectedType, setSelectedType] = useState(null);

	const handleSelection = item => {
		setSelectedType(item.value);
	};

	return (
		<>
			{!selectedType && (
				<Box flexDirection="column">
					<Text>What would you like to create?</Text>
					<SelectInput items={items} onSelect={handleSelection} />
				</Box>
			)}
			{selectedType === 'post' && <NewPost />}
			{selectedType === 'note' && <NewNote />}
		</>
	);
};

export default New;
