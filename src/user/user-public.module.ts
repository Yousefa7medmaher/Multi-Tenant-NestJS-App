import { Module } from '@nestjs/common';
import { UserPublicService } from './user-public.service';
import { AdminController } from './user-public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user-public.entity';
import { TenantModule } from 'src/tenant/tenant.module';
import { Tenant } from 'src/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User , Tenant]) ],
  controllers: [AdminController],
  providers: [UserPublicService ],
})
export class UserPublicModule {}
