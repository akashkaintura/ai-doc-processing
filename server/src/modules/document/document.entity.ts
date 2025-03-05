import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column('jsonb')
  metadata: Record<string, unknown>;

  @Column('jsonb')
  insights: Record<string, unknown>;
}
