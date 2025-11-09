import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Definimos el tipo del payload que esperamos del token
export interface JwtPayload {
  sub: string;
  email: string;
  rol: 'cliente' | 'prestador';
}

@Injectable()
export class JwtGeneralStrategy extends PassportStrategy(
  Strategy,
  'jwt-general',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Esta estrategia es "ligera": solo valida el token
  // y devuelve el payload. No busca en la BD.Esta es una buena practica para estrategias compartias, la empanada que puedes hacer para no hacer esto es mirar si es cliente y cuiando te de error mirar si es prestador, no es nada bueno pero te la dejo ahi por si quieres matarte la cabeza
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
