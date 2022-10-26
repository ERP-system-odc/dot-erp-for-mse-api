import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn, OneToMany} from "typeorm"
import { Standard } from "./Standard"

@Entity({name:"standard_settings"})
export class StandardSetting{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    inventory_name:string

   @Column({
    type:"double"
   })
    inventory_quantity:number


    @ManyToOne(() =>Standard,standard=>standard.standard_settings,{
        onDelete:"CASCADE"
    })   
    @JoinColumn()
    standard:Standard

}