import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { KnightService } from './knight.service';
import { Model } from 'mongoose';
import { Knight } from './schemas/knight.schema';
import { HallOfHeroes } from './schemas/hall-of-heroes.schema';

const mockKnightModel = {
    create: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({}),
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
    findByIdAndDelete: jest.fn().mockResolvedValue({}),
};

const mockHallOfHeroesModel = {
    create: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockResolvedValue([])
};

describe('KnightService', () => {
    let service: KnightService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KnightService,
                { provide: 'KnightModel', useValue: mockKnightModel },
                { provide: 'HallOfHeroesModel', useValue: mockHallOfHeroesModel },
            ],
        }).compile();

        service = module.get<KnightService>(KnightService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a knight', async () => {
            const knightData = { 
                name: "Sir Hubric",
                nickname: "Hub",
                birthday: "1988-02-27",
                weapons: [
                { name: "Montant", mod: 2, attr: "strength", equipped: true },
                { name: "Dagger", mod: 1, attr: "dexterity", equipped: false }
                ],
                attributes: {
                strength: 15,
                dexterity: 14,
                constitution: 12,
                intelligence: 16,
                wisdom: 12,
                charisma: 15
                },
                keyAttribute: "charisma"
            };
            const createdKnight = { id: '1', ...knightData };

            mockKnightModel.create.mockResolvedValue(createdKnight);

            const result = await service.create(knightData);

            expect(mockKnightModel.create).toHaveBeenCalledWith(expect.objectContaining(knightData));
            expect(result).toEqual(createdKnight);
        });
    });

    describe('findAll', () => {
        it('should return an array of knights', async () => {
            const knights = [{ 
                id: '1', 
                name: "Sir Hubric",
                nickname: "Hub",
                birthday: "1988-02-27",
                weapons: [
                { name: "Montant", mod: 2, attr: "strength", equipped: true },
                { name: "Dagger", mod: 1, attr: "dexterity", equipped: false }
                ],
                attributes: {
                strength: 15,
                dexterity: 14,
                constitution: 12,
                intelligence: 16,
                wisdom: 12,
                charisma: 15
                },
                keyAttribute: "charisma" 
            }, 
            { 
                id: '2',
                name: "Sir Galahad",
                nickname: "Gally",
                birthday: "1995-05-15",
                weapons: [
                    { name: "Excalibur", mod: 3, attr: "strength", equipped: true },
                    { name: "Bow", mod: 2, attr: "dexterity", equipped: false }
                ],
                attributes: {
                    strength: 18,
                    dexterity: 16,
                    constitution: 14,
                    intelligence: 12,
                    wisdom: 10,
                    charisma: 13
                },
                keyAttribute: "strength"
             }];
             mockKnightModel.find.mockResolvedValue(knights);

            const result = await service.findAll();

            expect(mockKnightModel.find).toHaveBeenCalled();
            expect(result).toEqual(knights);
        });
    });

    describe('findOne', () => {
        it('should return a knight by ID', async () => {
            const knightId = '1';
            const knightData = { 
                id: knightId, 
                name: "Sir Hubric",
                nickname: "Hub",
                birthday: "1988-02-27",
                weapons: [
                { name: "Montant", mod: 2, attr: "strength", equipped: true },
                { name: "Dagger", mod: 1, attr: "dexterity", equipped: false }
                ],
                attributes: {
                strength: 15,
                dexterity: 14,
                constitution: 12,
                intelligence: 16,
                wisdom: 12,
                charisma: 15
                },
                keyAttribute: "charisma" 
            };
            mockKnightModel.findById.mockResolvedValue(knightData);

            const result = await service.findOne(knightId);

            expect(mockKnightModel.findById).toHaveBeenCalledWith(knightId);
            expect(result).toEqual(knightData);
        });

        it('should throw NotFoundException if knight is not found', async () => {
            const knightId = '1';
            mockKnightModel.findById.mockResolvedValue(null);

            await expect(service.findOne(knightId)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a knight successfully', async () => {
            const knightId = '1';
            const updatedKnight = { 
                name: "Sir Galahad",
                nickname: "Gally",
                attack: 15,
                experience: 1945,
                birthday: "1995-05-15",
                weapons: [
                    { name: "Excalibur", mod: 3, attr: "strength", equipped: true },
                    { name: "Bow", mod: 2, attr: "dexterity", equipped: false }
                ],
                attributes: {
                    strength: 18,
                    dexterity: 16,
                    constitution: 14,
                    intelligence: 12,
                    wisdom: 10,
                    charisma: 13
                },
                keyAttribute: "strength" 
            };

            mockKnightModel.findByIdAndUpdate.mockResolvedValue(updatedKnight);
            mockKnightModel.findById.mockResolvedValue(updatedKnight);

            const result = await service.update(knightId, updatedKnight);

            expect(mockKnightModel.findByIdAndUpdate).toHaveBeenCalledWith(knightId, updatedKnight, { new: true });
            expect(result).toEqual(updatedKnight);
        });

        it('should throw NotFoundException if knight is not found', async () => {
            const knightId = '1';
            const knightData = { 
                name: "Sir Galahad",
                nickname: "Gally",
                birthday: "1995-05-15",
                weapons: [
                    { name: "Excalibur", mod: 3, attr: "strength", equipped: true },
                    { name: "Bow", mod: 2, attr: "dexterity", equipped: false }
                ],
                attributes: {
                    strength: 18,
                    dexterity: 16,
                    constitution: 14,
                    intelligence: 12,
                    wisdom: 10,
                    charisma: 13
                },
                keyAttribute: "strength"
             };
             mockKnightModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(service.update(knightId, knightData)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a knight successfully', async () => {
            const knightId = '1';
            const deletedKnight = { 
                id: knightId, 
                name: "Sir Hubric",
                nickname: "Hub",
                birthday: "1988-02-27",
                weapons: [
                { name: "Montant", mod: 2, attr: "strength", equipped: true },
                { name: "Dagger", mod: 1, attr: "dexterity", equipped: false }
                ],
                attributes: {
                strength: 15,
                dexterity: 14,
                constitution: 12,
                intelligence: 16,
                wisdom: 12,
                charisma: 15
                },
                keyAttribute: "charisma" 
             };

             mockKnightModel.findByIdAndDelete.mockResolvedValue(deletedKnight);

            const result = await service.remove(knightId);

            expect(mockKnightModel.findByIdAndDelete).toHaveBeenCalledWith(knightId);
            expect(result).toEqual(deletedKnight);
        });

        it('should throw NotFoundException if knight is not found', async () => {
            const knightId = '1';
            mockKnightModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(service.remove(knightId)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('findHeroes', () => {
        it('should return an array of heroes from HallOfHeroes', async () => {
            const heroes = [{ 
                id: '1', 
                name: "Sir Hubric",
                nickname: "Hub",
                birthday: "1988-02-27",
                weapons: [
                { name: "Montant", mod: 2, attr: "strength", equipped: true },
                { name: "Dagger", mod: 1, attr: "dexterity", equipped: false }
                ],
                attributes: {
                strength: 15,
                dexterity: 14,
                constitution: 12,
                intelligence: 16,
                wisdom: 12,
                charisma: 15
                },
                keyAttribute: "charisma" 
             }, 
             { 
                id: '2', 
                name: "Sir Galahad",
                nickname: "Gally",
                birthday: "1995-05-15",
                weapons: [
                    { name: "Excalibur", mod: 3, attr: "strength", equipped: true },
                    { name: "Bow", mod: 2, attr: "dexterity", equipped: false }
                ],
                attributes: {
                    strength: 18,
                    dexterity: 16,
                    constitution: 14,
                    intelligence: 12,
                    wisdom: 10,
                    charisma: 13
                },
                keyAttribute: "strength"
             }];
             mockHallOfHeroesModel.find.mockResolvedValue(heroes);

            const result = await service.findHeroes();

            expect(mockHallOfHeroesModel.find).toHaveBeenCalled();
            expect(result).toEqual(heroes);
        });
    });

    describe('calculateAttackAndExperience', () => {
        it('should calculate attack and experience correctly', () => {
            const knightData = { 
                name: "Sir Hubric",
                nickname: "Hub",
                birthday: "1988-02-27",
                weapons: [
                { name: "Montant", mod: 2, attr: "strength", equipped: true },
                { name: "Dagger", mod: 1, attr: "dexterity", equipped: false }
                ],
                attributes: {
                strength: 15,
                dexterity: 14,
                constitution: 12,
                intelligence: 16,
                wisdom: 12,
                charisma: 15
                },
                keyAttribute: "charisma"
            };
            const expectedAttack = 13;
            const expectedExperience = 2563;

            const { attack, experience } = service.calculateAttackAndExperience(knightData);

            expect(attack).toEqual(expectedAttack);
            expect(experience).toEqual(expectedExperience);
        });
    });

    describe('calculateAttack', () => {
        it('should calculate attack correctly', () => {
            const keyAttribute = 'strength';
            const equippedWeaponMod = 2;
            const attributes = { strength: 15 };

            const attack = service.calculateAttack(keyAttribute, equippedWeaponMod, attributes);

            expect(attack).toEqual(13);
        });
    });

    describe('calculateExperience', () => {
        it('should calculate experience correctly', () => {
            const age = 36;

            const experience = service.calculateExperience(age);

            expect(experience).toEqual(2563);
        });
    });
});
