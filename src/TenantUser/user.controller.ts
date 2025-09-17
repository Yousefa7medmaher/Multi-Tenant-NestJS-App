import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { TenantUser } from '../entities/tenant-user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':schema')
  create(@Param('schema') schema: string, @Body() userData: Partial<TenantUser>) {
    return this.userService.create(schema, userData);
  }

  @Get(':schema')
  findAll(@Param('schema') schema: string) {
    return this.userService.findAll(schema);
  }

  @Get(':schema/:id')
  findOne(@Param('schema') schema: string, @Param('id') id: string) {
    return this.userService.findOne(schema, +id);
  }

  @Patch(':schema/:id')
  update(
    @Param('schema') schema: string,
    @Param('id') id: string,
    @Body() data: Partial<TenantUser>,
  ) {
    return this.userService.update(schema, +id, data);
  }

  @Delete(':schema/:id')
  remove(@Param('schema') schema: string, @Param('id') id: string) {
    return this.userService.remove(schema, +id);
  }
}
