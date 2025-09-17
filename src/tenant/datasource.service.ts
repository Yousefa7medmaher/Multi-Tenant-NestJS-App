import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TenantUser } from '../entities/tenant-user.entity';

@Injectable()
export class TenantDataSourceService {
  constructor(private readonly configService: ConfigService) {}

  private async createDefaultDataSource(): Promise<DataSource> {
    const dataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<number>('DB_PORT')),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [],
      synchronize: false,
    });

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log(`Default DataSource initialized`);
    }

    return dataSource;
  }

  async createTenant(schema: string): Promise<DataSource> {
    const defaultDataSource = await this.createDefaultDataSource();
    await defaultDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    await defaultDataSource.destroy();    
    const tenantDataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<number>('DB_PORT')),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      schema,
      entities: [TenantUser],
      synchronize: true,
    });

    if (!tenantDataSource.isInitialized) {
      await tenantDataSource.initialize();
      console.log(`Tenant DataSource for schema "${schema}" initialized`);
    }

    return tenantDataSource;
  }
}
