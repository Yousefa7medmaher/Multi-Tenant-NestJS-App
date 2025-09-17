import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user-public.entity';


export interface JwtPayload { 
    sub  : number ;
    email : string ;
    role  : string ; 
    iat? : number;
    exp ? : number 
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
    constructor(
        private configService : ConfigService, 
        @InjectRepository(User)
        private TenantUserRepo : Repository<User>  
    ){ 
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload : JwtPayload ) : Promise<User> {  
        const { sub : userId} = payload ;
        const user =  await this.TenantUserRepo.findOne({
            where : {id : userId }
        });

        if ( !user)       throw new UnauthorizedException('User not found');

        return user ;

    }
}
