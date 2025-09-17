import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TenantUser } from '../entities/tenant-user.entity';

@Injectable()
export class TenantDataSourceService {
  constructor(private readonly configService: ConfigService) {}

  private getPostgresConnectionConfig() {
    return {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST') as string,
      port: Number(this.configService.get<number>('DB_PORT')),
      username: this.configService.get<string>('DB_USERNAME') as string,
      password: this.configService.get<string>('DB_PASSWORD') as string,
      database: this.configService.get<string>('DB_NAME') as string,
    };
  }

  private async createDefaultDataSource(): Promise<DataSource> {
    const dataSource = new DataSource({
      ...this.getPostgresConnectionConfig(),
      entities: [],
      synchronize: false,
    });

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('Default DataSource initialized');
    }

    return dataSource;
  }

  async createTenant(schema: string): Promise<DataSource> {
    const defaultDataSource = await this.createDefaultDataSource();
    await defaultDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    await defaultDataSource.destroy();

    const tenantDataSource = new DataSource({
      ...this.getPostgresConnectionConfig(),
      schema,
      entities: [TenantUser],
      synchronize: true,
    } as DataSourceOptions);

    if (!tenantDataSource.isInitialized) {
      await tenantDataSource.initialize();
      console.log(`Tenant DataSource for schema "${schema}" initialized`);
    }

    return tenantDataSource;
  }
}