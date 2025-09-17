import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { OmitType } from '@nestjs/mapped-types';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async create(@Body() createTenantDto: CreateTenantDto) {
    try {
      return await this.tenantService.create(createTenantDto);
    } catch (error) {
       if (error.status === HttpStatus.CONFLICT) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
       throw new HttpException('Failed to create tenant', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    return await this.tenantService.findAll();
  }
}
