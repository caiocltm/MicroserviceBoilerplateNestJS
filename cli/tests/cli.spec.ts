import CLI from '../src/cli';
import commander, { Command } from 'commander';

describe('CLI', () => {
	let cli: CLI;
	let command: commander.Command;

	beforeEach(async () => {
		command = new Command();

		cli = new CLI(command);
	});

	describe('setUI', () => {
		it('should set CLI UI components and return CLI class instance', () => {
			expect(cli.setUI()).toBeInstanceOf(CLI);
		});
	});

	describe('enableCreateAPIUserCommand', () => {
		it('should enable CLI create API user command and return CLI class instance', () => {
			expect(cli.enableCreateAPIUserCommand()).toBeInstanceOf(CLI);
		});
	});

	describe('build', () => {
		it('should build CLI', () => {
			cli.setUI().enableCreateAPIUserCommand();

			jest.spyOn(command, 'parse').mockReturnValue(undefined);

			expect(cli.build()).toBeUndefined();
		});

		it('should build CLI but found no command enabled', () => {
			cli.setUI();

			jest.spyOn(command, 'parse').mockReturnValue(undefined);

			expect(cli.build()).toBeUndefined();
		});
	});
});
