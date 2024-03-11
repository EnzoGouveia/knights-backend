import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../redis/redis.service';
import { Knight } from './schemas/knight.schema';
import { HallOfHeroes } from './schemas/hall-of-heroes.schema';

@Injectable()
export class KnightService {
    constructor(
        @InjectModel('Knight') private readonly knightModel: Model<Knight>,
        @InjectModel('HallOfHeroes') private readonly hallOfHeroesModel: Model<HallOfHeroes>,
        private readonly redisService: RedisService,
    ) {}

    async create(knightData): Promise<Knight> {
        await this.redisService.deleteKey('allKnights');
        const { attack, experience } = this.calculateAttackAndExperience(knightData);
    
        const createdKnight = await this.knightModel.create({
          ...knightData,
          attack,
          experience
        });
    
        return createdKnight;
    }

    async findAll(): Promise<Knight[]> {
        const cachedData = await this.redisService.getValue('allKnights');
        if (cachedData) {
            return JSON.parse(cachedData);
        } else {
            const knights = await this.knightModel.find();
            await this.redisService.setValue('allKnights', JSON.stringify(knights));
            return knights;
        }
    }

    async findOne(id: string): Promise<Knight> {
        const cachedData = await this.redisService.getValue(`knight:${id}`);
        if (cachedData) {
            return JSON.parse(cachedData);
        } else {
            const knight = await this.knightModel.findById(id);
            if (!knight) {
                throw new NotFoundException('Knight not found');
            }
            await this.redisService.setValue(`knight:${id}`, JSON.stringify(knight));
            return knight;
        }
    }

    async update(id: string, knightData): Promise<Knight> {

        const existingKnight = await this.knightModel.findById(id);
        if (!existingKnight) {
            throw new NotFoundException('Knight not found');
        }

        const updatedKnightData = {
            ...existingKnight,
            ...knightData
        };

        const { attack, experience } = this.calculateAttackAndExperience(updatedKnightData);

        updatedKnightData.attack = attack;
        updatedKnightData.experience = experience;

        const updatedKnight = await this.knightModel.findByIdAndUpdate(id, updatedKnightData, { new: true });
        if (!updatedKnight) {
            throw new NotFoundException('Knight not found');
        }
        await this.redisService.deleteKey('allKnights');
        await this.redisService.deleteKey(`knight:${id}`);
        return updatedKnight;
    }

    async remove(id: string): Promise<Knight> {
        const deletedKnight = await this.knightModel.findByIdAndDelete(id);
        if (!deletedKnight) {
            throw new NotFoundException('Knight not found');
        }
        await this.redisService.deleteKey(`knight:${id}`);
        await this.redisService.deleteKey('allKnights');
        await this.hallOfHeroesModel.create(deletedKnight);
        return deletedKnight;
    }

    async findHeroes(): Promise<HallOfHeroes[]> {
        return await this.hallOfHeroesModel.find();
    }

    calculateAttackAndExperience(knightData): { attack: number, experience: number } {
        const attributes = knightData.attributes;
        const equippedWeaponMod = knightData.weapons[0].mod;
        const keyAttribute = knightData.keyAttribute;
        const age = new Date().getFullYear() - new Date(knightData.birthday).getFullYear();

        const attack = this.calculateAttack(keyAttribute, equippedWeaponMod, attributes);
        const experience = this.calculateExperience(age);
        return { attack, experience };
    }

    calculateAttack(keyAttribute: string, equippedWeaponMod: number, attributes: any): number {
        const keyValue = attributes[keyAttribute];
    
        let attributeMod = 0;
        if (keyValue >= 0 && keyValue <= 8) {
            attributeMod = -2;
        } else if (keyValue >= 9 && keyValue <= 10) {
            attributeMod = -1;
        } else if (keyValue >= 11 && keyValue <= 12) {
            attributeMod = 0;
        } else if (keyValue >= 13 && keyValue <= 15) {
            attributeMod = 1;
        } else if (keyValue >= 16 && keyValue <= 18) {
            attributeMod = 2;
        } else if (keyValue >= 19 && keyValue <= 20) {
            attributeMod = 3;
        }
    
        return 10 + attributeMod + equippedWeaponMod;
    }

    calculateExperience(age: number): number {
        if (age <= 7) {
        return 0;
        }
        return Math.floor((age - 7) * Math.pow(22, 1.45));
    }
}
