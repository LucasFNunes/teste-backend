import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import bcrypt from "bcrypt";

@Entity("users") // Nome da tabela no banco de dados
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  password!: string;

  @Column({ type: "varchar", nullable: true, select: false })
  passwordResetToken?: string;

  @Column({ type: "timestamp", nullable: true, select: false })
  passwordResetExpires?: Date;

  @Column({ type: "boolean", default: false })
  isAuthenticated!: boolean;

  @Column({ type: "boolean", default: false })
  isTrashed!: boolean;

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 15;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}
