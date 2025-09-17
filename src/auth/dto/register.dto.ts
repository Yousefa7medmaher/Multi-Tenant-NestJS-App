import  { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator' ; 
import { UserRole } from '../../common/enums/user-role.enum';
export class RegisterDto { 
    @IsNotEmpty()
    name : string ; 

    @IsEmail()
    email:string ;

    @MinLength(6 , {message : "Password must be at least 6 characters long"})
    password : string ;

    @IsOptional()
    @IsEnum(UserRole , {message: 'Role must be one of: user, manager, admin' })
    role?: UserRole ;
}