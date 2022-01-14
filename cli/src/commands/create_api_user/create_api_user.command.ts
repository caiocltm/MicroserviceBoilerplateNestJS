import commander from 'commander';
import { Prompt } from '../../ui/prompt';
import { APIGatewayModule, UserCredentialsDto, AuthAPIModule, AuthAPIService } from '@api_gateway';
import { validate } from 'class-validator';
import { Spinner } from '../../ui/spinner';
import { NestFactory } from '@nestjs/core';
import { greenBright } from 'chalk';

export class CreateAPIUserCommand {
	private readonly COMMAND_NAME = 'create_api_user';

	constructor(
		private readonly prompt: Prompt,
		private readonly spinner: Spinner,
		private readonly CLI: commander.Command
	) {}

	public build(): void {
		this.CLI.command(this.COMMAND_NAME)
			.name(this.COMMAND_NAME)
			.description('Create a new API user given username and password')
			.action(/* istanbul ignore next */ async () => (await this.execute(), process.exit(0)));
	}

	public async execute(): Promise<void> {
		const { username } = await this.prompt.getUsername();

		const { password } = await this.prompt.getPassword();

		this.spinner.setText('Validating username and password');
		this.spinner.start();

		const userCredentials = await this.validateUserCredentials(username, password);

		if (!userCredentials) {
			this.spinner.fail('Cannot create API user given not valid credentials');

			return;
		}

		this.spinner.succeed('Username and password successfully validated');

		this.spinner.setText('Initializing Application context');
		this.spinner.start();
		const app = await NestFactory.createApplicationContext(APIGatewayModule, { logger: false });
		this.spinner.succeed('Application context created');

		this.spinner.setText('Initializing service class');
		this.spinner.start();
		const authService = app.select(AuthAPIModule).get(AuthAPIService, { strict: true });
		this.spinner.succeed('Service class selected');

		this.spinner.setText('Running API user creation...');
		this.spinner.start();

		try {
			const result = await authService.createUser(userCredentials);

			this.spinner.succeed(greenBright(result.message.toString()));
		} catch (error) {
			this.spinner.fail(`Cannot create API user given error: [${error.message}]`);
		}
	}

	private async validateUserCredentials(username: string, password: string): Promise<UserCredentialsDto> {
		const userCredentials = new UserCredentialsDto();

		userCredentials.username = username;
		userCredentials.password = password;

		const validationErrors = await validate(userCredentials, {
			forbidUnknownValues: true,
			forbidNonWhitelisted: true
		});

		if (validationErrors.length) {
			validationErrors.map((e) =>
				this.spinner.fail(
					`Cannot create user given ${e.property} has failed the following constraints: [${Object.keys(
						e.constraints
					)
						.join(', ')
						.toString()}]`
				)
			);

			return null;
		}

		return userCredentials;
	}
}
