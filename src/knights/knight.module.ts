import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnightController } from './knight.controller';
import { KnightService } from './knight.service';
import { KnightSchema } from './schemas/knight.schema';
import { HallOfHeroesSchema } from './schemas/hall-of-heroes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Knight', schema: KnightSchema },
      { name: 'HallOfHeroes', schema: HallOfHeroesSchema }
    ])],
  controllers: [KnightController],
  providers: [KnightService],
})
export class KnightModule {}