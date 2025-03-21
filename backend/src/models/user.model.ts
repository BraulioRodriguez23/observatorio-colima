import { Table, Column, Model, HasMany, BeforeUpdate, BeforeCreate } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import News from './news.model';
import Export from './export.model';

@Table({ tableName: 'users' })
export default class User extends Model {
  @Column({
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  })
  email!: string;

  @Column({
    allowNull: false,
    set(value: string) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    }
  })
  password!: string;

  @Column({
    defaultValue: 'editor',
    validate: { isIn: [['admin', 'editor']] }
  })
  role!: string;

  @HasMany(() => News)
  news!: News[];

  @HasMany(() => Export)
  exports!: Export[];
}