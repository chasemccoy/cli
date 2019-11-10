import {execSync} from 'child_process';

/// Journaling tools
const Log = ({inputArgs}) => {
	const args = inputArgs.slice(1).join(' ');
	execSync(`jrnl ${args}`, {stdio: 'inherit'});
	return null;
};

export default Log;
