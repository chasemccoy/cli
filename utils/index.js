import os from 'os';
import fs from 'fs';

const homeDirectory = os.homedir();

export const resolveHome = path => {
	return homeDirectory ? path.replace(/^~(?=$|\/|\\)/, homeDirectory) : path;
};

export const writeToFile = (path, contents) => {
	fs.writeFileSync(resolveHome(path), contents);
};

export const capitalize = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
