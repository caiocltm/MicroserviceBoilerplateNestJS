import { MicroserviceType } from '@microservices_config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { MongoDBConfig } from './mongodb.config';

@Module({})
export class MongoDBModule {
	static register(microservice: MicroserviceType, schemas: Array<{ name: string; schema: Schema }>): DynamicModule {
		const mongoDBConfig = new MongoDBConfig(new ConfigService());

		return {
			module: MongoDBModule,
			imports: [
				ConfigModule.forRoot(),
				MongooseModule.forRoot(mongoDBConfig.getUrl(microservice)),
				MongooseModule.forFeature(schemas)
			],
			providers: [],
			exports: [MongooseModule.forRoot(mongoDBConfig.getUrl(microservice)), MongooseModule.forFeature(schemas)]
		};
	}
}
