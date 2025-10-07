import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


//Protege las rutas con token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}