import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { User } from './User.entity';
import { File } from './File.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';

@Entity({ name: 'garbage_collect' })
export class GarbageCollect extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // TODO: should add user`s signature here

  @Column({ type: 'int', nullable: true })
  pointsGiven?: number;

  @Column({ type: 'varchar', nullable: true, length: 120 })
  description?: string;

  @Column({ type: 'boolean', default: false })
  merkleSubmitted: boolean;

  @OneToMany(() => DaoVote, (v) => v.garbageCollect, { cascade: true })
  daoVotes: DaoVote[];

  @OneToMany(() => File, (v) => v.garbageCollect, { cascade: true })
  files: File[];

  @ManyToOne(() => User, (v) => v.garbageCollects, { nullable: false, eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => MerkleSubmission, { cascade: true })
  @JoinTable()
  merkleSubmissions: MerkleSubmission[];
}
