import { Catch, ArgumentsHost, Logger, HttpStatus, ExceptionFilter, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
	private operation: string;
	private channel: any;
	private originalMessage: any;
	private messageId: string;
	private statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
	private message: string;
	private context: any;
	private exception: any;

	async catch(exception: any, host: ArgumentsHost, shouldAutoAck = true) {
		try {
			this.context = host.switchToRpc().getContext();
			this.exception = exception;

			this.setExceptionContext();

			this.logException();

			if (this.isRabbitMQContext() && shouldAutoAck) this.ackMessage();

			if (this.isRedisContext())
				return throwError(
					/* istanbul ignore next */ () => ({ statusCode: this.statusCode, message: this.message })
				);

			return throwError(
				/* istanbul ignore next */ () => ({ statusCode: this.statusCode, message: this.message })
			);
		} catch (error) {
			if (this.isRabbitMQContext() && shouldAutoAck) this.ackMessage();

			return throwError(
				/* istanbul ignore next */ () => ({ statusCode: this.statusCode, message: JSON.stringify(error) })
			);
		}
	}

	private logException(): void {
		Logger.log(
			`Operation: ${this.operation} -- StatusCode: ${this.getStatusCode(
				this.exception
			)} -- Message: ${this.getMessage(this.exception)}`,
			'MicroserviceExceptionFilter'
		);
	}

	private setExceptionContext(): void {
		if (this.isRedisContext()) {
			this.operation = this.context.args && this.context.args.length > 0 ? this.context.args.join('') : 'Unknown';
			return;
		}

		this.channel = this.context.getChannelRef();
		this.originalMessage = this.context.getMessage();

		const messageContent = this.originalMessage.content
			? JSON.parse(this.originalMessage.content.toString())
			: 'Unknown';

		this.operation =
			typeof messageContent === 'object' && messageContent.pattern ? messageContent.pattern : messageContent;
		this.messageId =
			typeof messageContent === 'object' && messageContent.data && messageContent.data.message_id
				? messageContent.data.message_id
				: messageContent;
	}

	public isRedisContext(): boolean {
		if (!(typeof this.context.getChannelRef === 'function' && typeof this.context.getMessage === 'function'))
			return true;
		return false;
	}

	public isRabbitMQContext(): boolean {
		if (typeof this.context.getChannelRef === 'function' && typeof this.context.getMessage === 'function')
			return true;
		return false;
	}

	public getMessage(exception: any): string {
		if (!exception) return `An unexpected error occurred on operation [${this.operation}], Exception: Unknown`;

		if (exception instanceof HttpException) {
			this.message = exception.message;
			return this.message;
		}

		if (exception instanceof RpcException) {
			this.message = exception.getError()['message'];
			return this.message;
		}

		this.message = exception.message;

		return this.message;
	}

	public getStatusCode(exception: any): number {
		if (!exception) return this.statusCode;

		if (exception instanceof HttpException) {
			this.statusCode = exception.getStatus();
			return this.statusCode;
		}

		if (exception instanceof RpcException) {
			this.statusCode = exception.getError()['statusCode'];
			return this.statusCode;
		}

		return this.statusCode;
	}

	public getOperationCacheKey(): string {
		return `${this.operation}---${this.messageId}`;
	}

	public getOperation(): string {
		return this.operation;
	}

	public ackMessage(): void {
		this.isRabbitMQContext() && this.channel && this.channel.ack(this.originalMessage);
	}

	public nackMessage(): void {
		this.isRabbitMQContext() && this.channel && this.channel.nack(this.originalMessage);
	}
}
