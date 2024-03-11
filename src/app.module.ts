import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnightModule } from './knights/knight.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/DQR-Tech'),
    KnightModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}