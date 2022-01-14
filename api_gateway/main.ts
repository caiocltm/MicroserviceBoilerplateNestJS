require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import { APIGatewayModule } from './src/api_gateway.module';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { json } from 'body-parser';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import { APIGatewayExceptionFilter } from '@common';

async function bootstrap() {
	const app = await NestFactory.create(APIGatewayModule);

	const configService = app.get(ConfigService);

	app.useGlobalFilters(new APIGatewayExceptionFilter());

	app.use(helmet());

	app.use(json({ limit: configService.get('API_GATEWAY_BODY_SIZE_LIMIT') }));

	const swaggerApiOptions = new DocumentBuilder()
		.setTitle('Webjump Microservices Boilerplate')
		.setDescription('Webjump microservices boilerplate')
		.setVersion('1.0.0')
		.build();

	const swaggerApiDocument: OpenAPIObject = SwaggerModule.createDocument(app, swaggerApiOptions);
	SwaggerModule.setup('api/docs', app, swaggerApiDocument);

	await app.listen(configService.get('API_GATEWAY_APPLICATION_PORT'));
}

bootstrap();
