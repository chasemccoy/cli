import {execSync} from 'child_process';

/// Chase's command line
const Main = () => {
	execSync('chs --help', {stdio: 'inherit'});
	return null;
};

export default Main;
