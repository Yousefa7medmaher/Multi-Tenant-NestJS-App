// src/admin/admin.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserPublicService } from './user-public.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserPublicService) {}

  @Post()
  create(@Body() createAdminDto: CreateUserDto) {
    return this.userService.create(createAdminDto);
  }ل

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }
}
