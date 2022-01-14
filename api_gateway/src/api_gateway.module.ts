import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthAPIModule } from './routes/auth/auth.api.module';
import { CustomersAPIModule } from './routes/customers/customers.api.module';

@Global()
@Module({
	imports: [ConfigModule.forRoot(), AuthAPIModule, CustomersAPIModule],
	exports: [ConfigModule.forRoot(), AuthAPIModule]
})
export class APIGatewayModule {}
