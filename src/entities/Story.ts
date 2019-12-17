import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

export type StatusType = 'pending' | 'rejected' | 'approved';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  summary: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  complexity: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'rejected', 'approved'],
    default: 'pending',
  })
  status: StatusType;

  @Column()
  estimatedHrs: string;

  @Column()
  cost: number;

  @ManyToOne(
    type => User,
    user => user.stories,
    {
      eager: true,
    }
  )
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
