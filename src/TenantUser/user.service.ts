import { Injectable } from '@nestjs/common';
import { TenantUser } from '../entities/tenant-user.entity';
import { DataSource, Repository } from 'typeorm';
import { createTenantDataSource } from '../database/tenant-datasource.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private userRepo: Repository<TenantUser>;

  constructor(private readonly configService: ConfigService) {}

  // Initialize repository for a specific tenant
  async initTenant(schema: string) {
    const dataSource: DataSource = await createTenantDataSource(
      schema,
      this.configService,
    );
    this.userRepo = dataSource.getRepository(TenantUser);
  }

  async create(schema: string, userData: Partial<TenantUser>) {
    await this.initTenant(schema);
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async findAll(schema: string) {
    await this.initTenant(schema);
    return this.userRepo.find();
  }

  async findOne(schema: string, id: number) {
    await this.initTenant(schema);
    return this.userRepo.findOneBy({ id });
  }

  async update(schema: string, id: number, data: Partial<TenantUser>) {
    await this.initTenant(schema);
    await this.userRepo.update(id, data);
    return this.userRepo.findOneBy({ id });
  }

  async remove(schema: string, id: number) {
    await this.initTenant(schema);
    return this.userRepo.delete(id);
  }
}
