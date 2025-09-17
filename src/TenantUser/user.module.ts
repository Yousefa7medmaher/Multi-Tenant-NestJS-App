import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantUser} from '../entities/tenant-user.entity'; 

@Module({
  imports:[TypeOrmModule.forFeature([TenantUser])],
  controllers: [UserController],
  providers: [UserService],
    exports: [UserService],

})
export class UserModule {}
