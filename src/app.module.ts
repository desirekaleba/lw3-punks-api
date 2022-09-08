import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAddressModule } from './user-address/user-address.module';

@Module({
  imports: [UserAddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
