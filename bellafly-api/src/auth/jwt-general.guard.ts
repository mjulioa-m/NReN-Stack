import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGeneralGuard extends AuthGuard('jwt-general') {}
