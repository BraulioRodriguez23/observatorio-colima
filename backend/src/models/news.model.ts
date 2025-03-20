import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table({ tableName: 'news' })
export default class News extends Model {
  @Column({ allowNull: false })
  title!: string;

  @Column({ allowNull: false })
  content!: string;

  @Column
  imageUrl!: string;

  @ForeignKey(() => User)
  @Column
  authorId!: number;

  @BelongsTo(() => User)
  author!: User;
}