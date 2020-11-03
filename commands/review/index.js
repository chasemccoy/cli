import {execSync} from 'child_process'

/// Open all modified notes in VS Code
const Review = () => {
	// Const args = inputArgs.slice(1).join(' ')
	const changedFiles = execSync(
		`pushd ~/Repositories/catalog/ > /dev/null && git status --short | awk '$1 ~ /^M|A|U/ {print $2}'  && popd > /dev/null`
	)
		.toString()
		.trim()
		.split('\n')

	const changedNotes = changedFiles
		.filter(file => file.includes('notes/'))
		.map(note => `~/Repositories/catalog/${note}`)

	execSync(`code ${changedNotes.join(' ')}`)

	return null
}

export default Review
