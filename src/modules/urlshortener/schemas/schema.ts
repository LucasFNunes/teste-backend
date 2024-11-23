import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

  @Column({ type: "boolean", default: false })
  isTrashed!: boolean;
}
