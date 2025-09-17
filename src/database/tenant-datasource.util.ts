import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TenantUser } from '../entities/tenant-user.entity';

export async function createTenantDataSource(
  schema: string,
  configService: ConfigService,  
) {
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: Number(configService.get<number>('DB_PORT')),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    schema,   
    entities: [TenantUser], 
    synchronize: true,
  });

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
    console.log(`Tenant DataSource for schema "${schema}" initialized`);
  }

  return dataSource;
}
