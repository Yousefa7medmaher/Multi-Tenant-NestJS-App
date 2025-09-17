import { Injectable  , ExecutionContext, Inject } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
@Injectable() 
export class JwtAuthGuard extends AuthGuard('jwt')  {
    constructor(private reflector : Reflector )  { 
        super();
    }

    canActivate(context: ExecutionContext) {
        
        return super.canActivate(context) ;
    }
}