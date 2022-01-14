import { Prompt } from '../src/ui/prompt';
import * as inquirer from 'inquirer';

describe('Prompt', () => {
	let cliPrompt: Prompt;

	beforeEach(async () => {
		cliPrompt = new Prompt();
	});

	describe('getPassword', () => {
		it('should get password provided by the user', async () => {
			const expected: object = { password: 'test_unitario' };

			jest.spyOn(inquirer, 'prompt').mockResolvedValue(expected);

			const result = await cliPrompt.getPassword();

			expect(result).toBe(expected);
		});
	});

	describe('getUsername', () => {
		it('should get username provided by the user', async () => {
			const expected: object = { username: 'test_unitario' };

			jest.spyOn(inquirer, 'prompt').mockResolvedValue(expected);

			const result = await cliPrompt.getUsername();

			expect(result).toBe(expected);
		});
	});

	describe('isNotEmpty', () => {
		it('should return true given not empty value', () => {
			const value: string = 'teste_unitario';

			const result = cliPrompt.isNotEmpty(value);

			expect(result).toBeTruthy();
		});

		it('should throw an Error exception given empty value', () => {
			const value: string = null;

			const expected: Error = new Error('Field cannot be empty');

			try {
				cliPrompt.isNotEmpty(value);
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect(error).toEqual(expected);
			}
		});
	});
});
