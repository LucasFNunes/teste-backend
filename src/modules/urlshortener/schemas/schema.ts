import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("urlShortener") // Nome da tabela no banco de dados
export class UrlShortener {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: false })
  userId!: string;

  @Column({ type: "varchar", nullable: false })
  url!: string;

  @Column({ type: "varchar", nullable: false })
  urlShortened!: string;

  @Column({ type: "int", nullable: false, default: 0 })
  clicks!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;

  @Column({ type: "boolean", default: false })
  isTrashed!: boolean;
}
