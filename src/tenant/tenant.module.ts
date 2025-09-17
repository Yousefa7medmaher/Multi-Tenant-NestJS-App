import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { TenantDataSourceService } from './datasource.service';

@Module({
  imports:[TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [TenantService , TenantDataSourceService],
  exports:[TenantService, TenantDataSourceService]
})
export class TenantModule {}
