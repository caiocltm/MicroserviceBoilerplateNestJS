import { Injectable } from '@nestjs/common';
import * as Ora from 'ora';

@Injectable()
export class Spinner {
	private spinner: Ora.Ora;

	constructor(spinner: Ora.Ora) {
		this.spinner = spinner;
	}

	public start(): void {
		this.spinner.start();
	}

	public succeed(text: string): void {
		this.spinner.succeed(text);
	}

	public fail(text: string): void {
		this.spinner.fail(text);
	}

	public setText(text: string): void {
		this.spinner.text = text;
	}
}
