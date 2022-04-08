const {Command, flags} = require('@oclif/command');
const download = require('download-git-repo');
const childProcess = require('child_process');

const repURL = 'https://github.com/LborV/gedyx/archive/refs/heads/main.zip';

class GedyxInstallerCommand extends Command {
	install(dest = './') {
		try {
			console.log('Downloading project from GitHub...');
			download('direct:'+repURL, dest, function (err) {
				if(err) {
					console.error('Error occured while downloading, please, try again');
					return;
				}

				console.log('Successfully downloaded');
				console.log('Running npm install...');
				childProcess.execSync(`cd ${dest} && cd ./app && npm i`, {stdio:[0,1,2]});
			});
		} catch (err) {
			console.error(err)
		}
	}

	async run() {
		const {flags} = this.parse(GedyxInstallerCommand);
		let dest = './gedyx';
		if(typeof flags.destination === 'string' && flags.destination != '') {
			dest = flags.destination;
		}

		if(flags.install) {
			return this.install(dest);
		}
		
		this._help();
	}
}

GedyxInstallerCommand.description = "GEDYX";

GedyxInstallerCommand.flags = {
	version: flags.version({char: 'v', description: 'Display this application version'}),
	help: flags.help({char: 'h', description: 'Display this help message'}),
	install: flags.boolean({char: 'i', description: 'If specified, will be downloaded and prepared to work'}),
	destination: flags.string({char: 'd', description: 'If specified, use the given directory as working directory.'})
};

module.exports = GedyxInstallerCommand;
