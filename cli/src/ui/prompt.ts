import { Injectable } from '@nestjs/common';
import { prompt } from 'inquirer';

@Injectable()
export class Prompt {
	public getUsername(): Promise<any> {
		return prompt([
			{
				type: 'input',
				name: 'username',
				default: null,
				message: 'Username',
				validate: this.isNotEmpty
			}
		]);
	}

	public getPassword(): Promise<any> {
		return prompt([
			{
				type: 'password',
				name: 'password',
				default: null,
				message: 'Password',
				validate: this.isNotEmpty
			}
		]);
	}

	public isNotEmpty(value: any): boolean {
		if (!value) throw Error('Field cannot be empty');

		return true;
	}
}
