// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user-public.entity';
import { Tenant } from '../entities/tenant.entity';
import { CreateUserDto} from './dto/create-user.dto'; 
@Injectable()
export class UserPublicService {
  constructor(
    @InjectRepository(User)
    private readonly adminRepo: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, tenantId } = createUserDto;

    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const admin = this.adminRepo.create({
      name,
      email,
      password,
      tenant,  
    });

    return this.adminRepo.save(admin);
  }

  async findAll(): Promise<User[]> {
    return this.adminRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }
}
