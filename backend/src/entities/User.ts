import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class User {
  @PrimaryKey()
  id!: number

  @Property()
  name!: string

  @Property({ unique: true })
  email!: string

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
}