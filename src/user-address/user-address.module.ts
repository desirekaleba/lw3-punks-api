import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';

@Module({
  imports: [HttpModule],
  providers: [UserAddressService],
  controllers: [UserAddressController],
})
export class UserAddressModule {}
