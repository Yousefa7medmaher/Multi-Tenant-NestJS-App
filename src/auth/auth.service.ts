import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { TenantUser } from 'src/entities/tenant-user.entity';
import { User } from 'src/entities/user-public.entity';
import { Tenant } from 'src/entities/tenant.entity';

import { TenantService } from '../tenant/tenant.service';
import { TenantDataSourceService } from '../tenant/datasource.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TenantUser)
    private readonly tenantUserRepo: Repository<TenantUser>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,

  private readonly tenantService: TenantService,
  private readonly tenantDataSourceService: TenantDataSourceService,
  private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, req: any) {
    const { name, email, password, role } = registerDto;

    if (!name || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const tenantHeader = req.headers['tenant'];

    if (tenantHeader) {
      const tenant = await this.tenantRepo.findOne({
        where: { schemaName: tenantHeader },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }

      const tenantDataSource =
        await this.tenantDataSourceService.createTenant(tenantHeader);
      const tenantUserRepo = tenantDataSource.getRepository(TenantUser);

      const isExist = await tenantUserRepo.findOne({ where: { email } });
      if (isExist) {
        throw new ConflictException('User already exists in tenant');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = tenantUserRepo.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
      });

      await tenantUserRepo.save(newUser);
      await tenantDataSource.destroy();

      return { message: 'Tenant user registered successfully' };
    }

    const isExist = await this.userRepo.findOne({ where: { email } });
    if (isExist) {
      throw new ConflictException('User already exists in public schema');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await this.userRepo.save(newUser);
    return { message: 'Admin user registered successfully' };
  }

  async login(loginDto: LoginDto, req: any) {
    const { email, password } = loginDto;
    const tenantHeader = req.headers['tenant'];

const jwtSecret = this.configService.get<string>('JWT_SECRET');
if (!jwtSecret) throw new Error('JWT_SECRET is not set in environment');
  const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '3600s';

  if (tenantHeader) {
      const tenant = await this.tenantRepo.findOne({
        where: { schemaName: tenantHeader },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }

      const tenantDataSource =
        await this.tenantDataSourceService.createTenant(tenantHeader);
      const tenantUserRepo = tenantDataSource.getRepository(TenantUser);

      const user = await tenantUserRepo.findOne({ where: { email } });
      if (!user) {
        await tenantDataSource.destroy();
        throw new UnauthorizedException('User not found in tenant');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        await tenantDataSource.destroy();
        throw new UnauthorizedException('Invalid credentials');
      }

  await tenantDataSource.destroy();
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  return { message: 'Login successful (tenant)', user, accessToken };
    }

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found in public schema');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  return { message: 'Login successful (admin)', user, accessToken };
  }
}
