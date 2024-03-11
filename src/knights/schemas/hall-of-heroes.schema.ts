import * as mongoose from 'mongoose';

export interface HallOfHeroes extends mongoose.Document {
  name: string;
  nickname: string;
  birthday: Date;
  weapons: {
    name: string;
    mod: number;
    attr: string;
    equipped: boolean;
  }[];
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  keyAttribute: string;
  attack: number;
  experience: number;
}

export const HallOfHeroesSchema = new mongoose.Schema({
  name: String,
  nickname: String,
  birthday: Date,
  weapons: [
    {
      name: String,
      mod: Number,
      attr: String,
      equipped: Boolean,
    }
  ],
  attributes: {
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
  },
  keyAttribute: String,
  attack: Number, 
  experience: Number,
});

export const HallOfHeroesModel = mongoose.model<HallOfHeroes>('HallOfHeroes', HallOfHeroesSchema);