import { ConfigService } from '@nestjs/config';

export class MongoDBConfig {
	constructor(private readonly configService: ConfigService) {}

	public getUrl(database: string): string {
		return `${this.configService.get('MONGODB_CONNECTION_URL')}${database}`;
	}
}
