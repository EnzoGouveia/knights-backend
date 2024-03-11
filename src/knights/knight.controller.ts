import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { KnightService } from './knight.service';
import { Knight } from './schemas/knight.schema';
import { HallOfHeroes } from './schemas/hall-of-heroes.schema';

@Controller('knights')
export class KnightController {
  constructor(private readonly knightService: KnightService) {}

  @Post()
  async create(@Body() knightData): Promise<Knight> {
    return await this.knightService.create(knightData);
  }

  @Get()
  async findAll(@Query('filter') filter: string): Promise<Knight[] | HallOfHeroes[]> {
    if (filter === 'heroes') {
      return await this.knightService.findHeroes();
    }
    return await this.knightService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Knight> {
    return await this.knightService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() knightData): Promise<Knight> {
    return await this.knightService.update(id, knightData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Knight> {
    return await this.knightService.remove(id);
  }
}