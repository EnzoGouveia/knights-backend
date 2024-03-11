import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'knight' })
export class KnightEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'nickname', nullable: false })
  nickname: string;

  @Column({ name: 'birthday', nullable: false })
  birthday: string;

  @OneToMany(() => WeaponEntity, (weapon) => weapon.knight)
  weapons: WeaponEntity[];

  @Column({ name: 'strength', default: 0 })
  strength: number;

  @Column({ name: 'dexterity', default: 0 })
  dexterity: number;

  @Column({ name: 'constitution', default: 0 })
  constitution: number;

  @Column({ name: 'intelligence', default: 0 })
  intelligence: number;

  @Column({ name: 'wisdom', default: 0 })
  wisdom: number;

  @Column({ name: 'charisma', default: 0 })
  charisma: number;

  @Column({ name: 'key_attribute', nullable: false })
  keyAttribute: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial?: Partial<KnightEntity>) {
    Object.assign(this, partial);
  }
}

@Entity({ name: 'weapon' })
export class WeaponEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'mod', nullable: false })
  mod: number;

  @Column({ name: 'attr', nullable: false })
  attr: string;

  @Column({ name: 'equipped', default: false })
  equipped: boolean;

  @ManyToOne(() => KnightEntity, (knight) => knight.weapons)
  knight: KnightEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial?: Partial<WeaponEntity>) {
    Object.assign(this, partial);
  }
}