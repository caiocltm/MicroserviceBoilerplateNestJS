import commander from 'commander';
import { bgRedBright, black } from 'chalk';
import { BANNER } from './ui/banner';
import { CreateAPIUserCommand } from './commands/create_api_user/create_api_user.command';
import { Prompt } from './ui/prompt';
import { Spinner } from './ui/spinner';
import * as Ora from 'ora';

export default class CLI {
	private readonly CLI: commander.Command;
	private createAPIUserCommand: CreateAPIUserCommand;
	private prompt: Prompt;
	private spinner: Spinner;

	constructor(command: commander.Command) {
		this.CLI = command;
	}

	public setUI(): this {
		this.CLI.name(bgRedBright('npm run cli:'));
		this.CLI.version(bgRedBright('1.0.0'));
		this.CLI.description(bgRedBright(black(BANNER)));
		this.CLI.usage(bgRedBright('<command>'));
		this.prompt = new Prompt();
		this.spinner = new Spinner(Ora({ spinner: 'arrow3', color: 'blue', interval: 30, prefixText: '\n' }));

		return this;
	}

	public enableCreateAPIUserCommand(): this {
		this.createAPIUserCommand = new CreateAPIUserCommand(this.prompt, this.spinner, this.CLI);

		return this;
	}

	public build(): void {
		this.createAPIUserCommand instanceof CreateAPIUserCommand && this.createAPIUserCommand.build();

		this.parseCLI();
	}

	private parseCLI(): void {
		this.CLI.parse();
	}
}
