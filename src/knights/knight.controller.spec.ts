import { Test, TestingModule } from '@nestjs/testing';
import { KnightController } from './knight.controller';
import { KnightService } from './knight.service';

const newKnight = {
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

const updateKnight = {
  name: "Sir Korad",
  nickname: "Kor",
  birthday: "1988-02-27",
  weapons: [
    { name: "Sword", mod: 2, attr: "strength", equipped: true },
    { name: "Bow", mod: 1, attr: "dexterity", equipped: false }
  ],
  attributes: {
    strength: 15,
    dexterity: 14,
    constitution: 12,
    intelligence: 16,
    wisdom: 12,
    charisma: 15
  },
  keyAttribute: "strength"
};

const knightList = [
  newKnight,
  updateKnight
];

describe('KnightController', () => {
  let knightController: KnightController;
  let knightService: KnightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnightController],
      providers: [
        {
          provide: KnightService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(knightList),
            create: jest.fn().mockResolvedValue(newKnight),
            findOne: jest.fn().mockResolvedValue(knightList[0]),
            findHeroes: jest.fn().mockResolvedValue(knightList),
            update: jest.fn().mockResolvedValue(updateKnight),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    knightController = module.get<KnightController>(KnightController);
    knightService = module.get<KnightService>(KnightService);
  });

  it('should be defined', () => {
    expect(knightController).toBeDefined();
    expect(knightService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new knight', async () => {
      const body = {
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

      const result = await knightController.create(body);

      expect(result).toEqual(newKnight);
      expect(knightService.create).toHaveBeenCalledTimes(1);
      expect(knightService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      const body = {
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

      jest.spyOn(knightService, 'create').mockRejectedValueOnce(new Error());

      expect(knightController.create(body)).rejects.toThrowError();
    })
  });

  describe('findAll', () => {
    it('should return all knights', async () => {
      const result = await knightController.findAll(undefined);

      expect(result).toEqual(knightList);
      expect(typeof result).toEqual('object');
      expect(knightService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return all heroes when filter is "heroes"', async () => {
      const result = await knightController.findAll('heroes');

      expect(result).toEqual(knightList);
      expect(typeof result).toEqual('object');
    });

    it('should throw an exception', () => {
      jest.spyOn(knightService, 'findAll').mockRejectedValueOnce(new Error());

      expect(knightController.findAll(undefined)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a knight by id', async () => {

      const result = await knightController.findOne('1');

      expect(result).toEqual(knightList[0]);
      expect(knightService.findOne).toHaveBeenCalledTimes(1);
      expect(knightService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw an exception', async () => {
      jest.spyOn(knightService, 'findOne').mockRejectedValueOnce(new Error());

      await expect(knightController.findOne('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a knight by id', async () => {
      const body = {
        name: "Sir Korad",
        nickname: "Kor",
        birthday: "1988-02-27",
        weapons: [
          { name: "Sword", mod: 2, attr: "strength", equipped: true },
          { name: "Bow", mod: 1, attr: "dexterity", equipped: false }
        ],
        attributes: {
          strength: 15,
          dexterity: 14,
          constitution: 12,
          intelligence: 16,
          wisdom: 12,
          charisma: 15
        },
        keyAttribute: "strength"
      };

      const result = await knightController.update('1', body);

      expect(result).toEqual(updateKnight);
      expect(knightService.update).toHaveBeenCalledTimes(1);
      expect(knightService.update).toHaveBeenCalledWith('1', body);
    });

    it('should throw NotFoundException if knight not found', async () => {
      const body = {
        name: "Sir Korad",
        nickname: "Kor",
        birthday: "1988-02-27",
        weapons: [
          { name: "Sword", mod: 2, attr: "strength", equipped: true },
          { name: "Bow", mod: 1, attr: "dexterity", equipped: false }
        ],
        attributes: {
          strength: 15,
          dexterity: 14,
          constitution: 12,
          intelligence: 16,
          wisdom: 12,
          charisma: 15
        },
        keyAttribute: "strength"
      }

      jest.spyOn(knightService, 'update').mockRejectedValueOnce(new Error());

      await expect(knightController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should remove a knight by id', async () => {

      const result = await knightController.remove('1');

      expect(result).toBeUndefined();
      expect(knightService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if knight not found', async () => {
      jest.spyOn(knightService, 'remove').mockRejectedValueOnce(new Error());

      await expect(knightController.remove('1')).rejects.toThrowError();
    });
  });
});