import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantDataSourceService } from './datasource.service';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    private readonly tenantDataSourceService: TenantDataSourceService,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const schemaName = createTenantDto.name.toLowerCase();

    const existingTenant = await this.tenantRepo.findOne({
      where: { schemaName },
    });
    if (existingTenant) {
      throw new ConflictException(`Tenant with schema "${schemaName}" already exists.`);
    }

    const dataSource = await this.tenantDataSourceService.createTenant(schemaName);
    await dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    const tenant = this.tenantRepo.create({
      name: createTenantDto.name,
      schemaName,
    });
    await this.tenantRepo.save(tenant);

    await dataSource.destroy();

    return tenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepo.find();
  }
}
