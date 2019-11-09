import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { resolveHome, writeToFile, capitalize } from '../../utils'; 
import SelectInput from 'ink-select-input';
import { Box, Text, Color } from 'ink';

const types = ['note', 'post'] // repo? project? short url? 

// this is the format that SelectInput expects
const items = types.map(item => (
  {
    label: capitalize(item),
    value: item
  }
))

const createFile = (type, destination) => {
  switch (type) {
    case 'note':
      writeToFile(`${destination}/notes/note.mdx`, 'Testing...')
      return
    case 'post':
      writeToFile(`${destination}/posts/post.mdx`, 'Testing...')
      return
  }
}

/// Create a new note or post
const New = ({ inputArgs, destination }) => {
  const type = inputArgs[1] // if undefined or not a valid type, prompt for type
  const [selectedType, setSelectedType] = useState(null) // flow will proceed when this value is set

  const handleSelection = (item) => {
    setSelectedType(item.value)
    createFile(item.value, destination)
  }

  if (!types.includes(type)) {
    return (
      <React.Fragment>
        {!selectedType && (
          <Box flexDirection='column'>
            <Text>What would you like to create?</Text>
            <SelectInput items={items} onSelect={handleSelection} />
          </Box>
        )}
        {selectedType && <Color green>{capitalize(selectedType)} created at {destination}</Color>}
      </React.Fragment>
    )
  }

  createFile(type, destination)

  return null
}

New.propTypes = {
  /// File path where the item should be created
  destination: PropTypes.string
}

New.defaultProps = {
  destination: '~/Repositories/catalog'
}

New.shortFlags = {
	destination: 'd'
}

export default New
