import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantUser } from 'src/entities/tenant-user.entity';
import { User } from 'src/entities/user-public.entity';
import { Tenant } from 'src/entities/tenant.entity';
import { TenantModule } from 'src/tenant/tenant.module';
import { UserPublicModule } from 'src/user/user-public.module';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([TenantUser, User, Tenant]),  
    TenantModule,
    UserPublicModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],  
})
export class AuthModule {}
