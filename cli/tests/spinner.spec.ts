import { Spinner } from '../src/ui/spinner';

const SpinnerMock: any = {
	start: jest.fn().mockReturnValue(undefined),
	succeed: jest.fn().mockReturnValue(undefined),
	fail: jest.fn().mockReturnValue(undefined),
	text: ''
};

describe('Spinner', () => {
	let spinner: Spinner;

	beforeEach(async () => {
		spinner = new Spinner(SpinnerMock);
	});

	describe('start', () => {
		it('should execute start spinner', () => {
			expect(spinner.start()).toBeUndefined();
		});
	});

	describe('succeed', () => {
		it('should execute succeed spinner', () => {
			expect(spinner.succeed('teste_unitario')).toBeUndefined();
		});
	});

	describe('fail', () => {
		it('should execute fail spinner', () => {
			expect(spinner.fail('teste_unitario')).toBeUndefined();
		});
	});

	describe('setText', () => {
		it('should set spinner text', () => {
			expect(spinner.setText('teste_unitario')).toBeUndefined();
		});
	});
});
