import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Prestador } from '../entities/prestadore.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Prestador)
    private prestadorRepository: Repository<Prestador>,
  ) {
    // Configuración de la estrategia
    super({
      // 1. De dónde sacar el token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. No fallar si el token está expirado (lo validamos nosotros)
      ignoreExpiration: false,
      // 3. La clave secreta para verificar el token (del .env)
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // 4. ¡ESTO ES LO MÁS IMPORTANTE!
  //    Esta función se ejecuta DESPUÉS de que el token se verifica.
  //    Recibe el 'payload' que pusimos en el token (id, email, rol).
  async validate(payload: { sub: string; email: string; rol: string }) {
    // Verificamos que el usuario del token (sub = id) todavía exista
    const prestador = await this.prestadorRepository.findOneBy({
      id: payload.sub,
    });

    if (!prestador || payload.rol !== 'prestador') {
      throw new UnauthorizedException('Token no válido');
    }

    // Lo que retornemos aquí, NestJS lo pondrá en `req.user`
    return prestador;
  }
}
