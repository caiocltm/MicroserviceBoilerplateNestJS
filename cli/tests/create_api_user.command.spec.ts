import * as Ora from 'ora';
import commander, { Command } from 'commander';
import { HttpStatus } from '@nestjs/common';
import { Spinner } from '../src/ui/spinner';
import { Prompt } from '../../cli/src/ui/prompt';
import { CreateAPIUserCommand } from '../src/commands/create_api_user/create_api_user.command';
import { ResponseTypeDto } from '@api_gateway';
import { NestFactory } from '@nestjs/core';

describe('CreateAPIUserCommand', () => {
	let createAPIUserCommand: CreateAPIUserCommand;
	let prompt: Prompt;
	let spinner: Spinner;
	let cli: commander.Command;

	beforeEach(async () => {
		prompt = new Prompt();
		spinner = new Spinner(Ora({ spinner: 'arrow3', color: 'blue', interval: 30, prefixText: '\n' }));
		cli = new Command();

		createAPIUserCommand = new CreateAPIUserCommand(prompt, spinner, cli);
	});

	describe('build', () => {
		it('should build CLI command', () => {
			expect(createAPIUserCommand.build()).toBeUndefined();
		});
	});

	describe('execute', () => {
		it('should execute CLI command to successfully create a new API user', async () => {
			const username: object = { username: 'teste_unitario' };
			const password: object = { password: 'Password@123' };

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.CREATED;
			expected.message = `API user [username] successfully registered`;

			jest.spyOn(prompt, 'getUsername').mockResolvedValue(username);
			jest.spyOn(prompt, 'getPassword').mockResolvedValue(password);
			jest.spyOn(spinner, 'setText').mockReturnValue(undefined);
			jest.spyOn(spinner, 'succeed').mockReturnValue(undefined);
			jest.spyOn(spinner, 'fail').mockReturnValue(undefined);
			jest.spyOn(spinner, 'start').mockReturnValue(undefined);
			// @ts-ignore
			jest.spyOn(NestFactory, 'createApplicationContext').mockImplementation(() => {
				return Promise.resolve({
					select: jest.fn().mockImplementation(() => ({
						get: jest.fn().mockImplementation(() => ({
							createUser: jest.fn().mockResolvedValue(expected)
						}))
					}))
				});
			});

			const result = await createAPIUserCommand.execute();

			expect(result).toBeUndefined();
		});

		it('should execute CLI command and not successfully create a new API user given thrown exception', async () => {
			const username: object = { username: 'teste_unitario' };
			const password: object = { password: 'Password@123' };

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
			expected.message = `API user [username] already exists`;

			jest.spyOn(prompt, 'getUsername').mockResolvedValue(username);
			jest.spyOn(prompt, 'getPassword').mockResolvedValue(password);
			jest.spyOn(spinner, 'setText').mockReturnValue(undefined);
			jest.spyOn(spinner, 'succeed').mockReturnValue(undefined);
			jest.spyOn(spinner, 'fail').mockReturnValue(undefined);
			jest.spyOn(spinner, 'start').mockReturnValue(undefined);
			// @ts-ignore
			jest.spyOn(NestFactory, 'createApplicationContext').mockImplementation(() => {
				return Promise.resolve({
					select: jest.fn().mockImplementation(() => ({
						get: jest.fn().mockImplementation(() => ({
							createUser: jest.fn().mockRejectedValue(expected)
						}))
					}))
				});
			});

			const result = await createAPIUserCommand.execute();

			expect(result).toBeUndefined();
		});

		it('should execute CLI command and stop process given invalid user credentials', async () => {
			const username: object = { username: 'teste_unitario' };
			const password: object = { password: '12345678910' };

			jest.spyOn(prompt, 'getUsername').mockResolvedValue(username);
			jest.spyOn(prompt, 'getPassword').mockResolvedValue(password);
			jest.spyOn(spinner, 'setText').mockReturnValue(undefined);
			jest.spyOn(spinner, 'succeed').mockReturnValue(undefined);
			jest.spyOn(spinner, 'fail').mockReturnValue(undefined);
			jest.spyOn(spinner, 'start').mockReturnValue(undefined);

			const result = await createAPIUserCommand.execute();

			expect(result).toBeUndefined();
		});
	});
});
