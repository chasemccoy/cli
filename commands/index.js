import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';
import { execSync } from 'child_process';

/// Chase's command line
const Main = () => {
	execSync('chs --help', { stdio: 'inherit' })
	return null
}

export default Main