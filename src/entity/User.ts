import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"


@Entity({name:"users"})
export class User{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullname:string

    @Column()
    email:string

    @Column()
    phonenumber:string


    @Column()
    role:string

}
