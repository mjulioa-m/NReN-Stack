import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
// 1. Nombramos la estrategia 'jwt-cliente' para diferenciarla de la de prestador. si usamos el mismo token que el prestador el prestador va a poder "hackear" al cliente
export class JwtClienteStrategy extends PassportStrategy(
  Strategy,
  'jwt-cliente',
) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; rol: string }) {
    //    Rechazamos el token si no es de un cliente.Si no se nos meten en el rancho y los clientes van a empezar a joder
    if (payload.rol !== 'cliente') {
      throw new UnauthorizedException('Token no válido para este rol');
    }

    const cliente = await this.clienteRepository.findOneBy({ id: payload.sub });

    if (!cliente) {
      throw new UnauthorizedException('Cliente no encontrado');
    }

    return cliente;
  }
}
