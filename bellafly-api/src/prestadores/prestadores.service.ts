import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrestadorDto } from './dto/create-prestadore.dto';
import { Prestador } from './entities/prestadore.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginPrestadorDto } from './dto/login-prestador.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PrestadoresService {
  constructor(
    @InjectRepository(Prestador)
    private prestadorRepository: Repository<Prestador>,
    private jwtService: JwtService,
  ) {}

  async create(createPrestadorDto: CreatePrestadorDto) {
    const { nombre, email, password } = createPrestadorDto;

    // 3. Revisar si el email ya existe
    const prestadorExistente = await this.prestadorRepository.findOneBy({
      email,
    });
    if (prestadorExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    // 4. Hashear la contraseña. La seguridad primero q estamos en LATAM
    const salt = await bcrypt.genSalt();
    const passwordHasheada = await bcrypt.hash(password, salt);

    // 5. Crear la nueva entidad
    const nuevoPrestador = this.prestadorRepository.create({
      nombre,
      email,
      password: passwordHasheada,
    });

    // 6. Guardar en la base de datos
    const prestadorGuardado =
      await this.prestadorRepository.save(nuevoPrestador);

    const { password: _, ...resultado } = prestadorGuardado;

    return resultado;
  }

  async login(loginPrestadorDto: LoginPrestadorDto) {
    const { email, password } = loginPrestadorDto;

    const prestador = await this.prestadorRepository.findOne({
      where: { email },
      select: ['id', 'email', 'nombre', 'password'],
    });

    if (!prestador) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // B. Comparar la contraseña enviada con el hash de la BD
    const esPasswordCorrecta = await bcrypt.compare(
      password,
      prestador.password,
    );

    if (!esPasswordCorrecta) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // C. Si todo es correcto, crear el Token (Payload)
    const payload = {
      sub: prestador.id, // 'sub' es el estándar para el ID de usuario. según gemini, lo deje porque es corto
      email: prestador.email,
      rol: 'prestador', // ¡Importante para los permisos!
    };

    // D. Firmar y devolver el token
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      accessToken, // Esto es lo que la app de React Native guardará
    };
  }

  async updatePerfil(prestadorId: string, updatePerfilDto: UpdatePerfilDto) {
    // 1. Buscamos el prestador (sin 'await' para que sea una referencia)
    // Usamos 'findOneBy' que es más simple
    const prestador = await this.prestadorRepository.findOneBy({
      id: prestadorId,
    });

    if (!prestador) {
      throw new NotFoundException('Prestador no encontrado');
    }

    // 2. Fusionamos los datos del DTO con la entidad encontrada
    Object.assign(prestador, updatePerfilDto);

    // 3. Guardamos los cambios
    const prestadorActualizado = await this.prestadorRepository.save(prestador);

    // 4. Devolvemos el perfil actualizado sin el password
    const { password: _, ...resultado } = prestadorActualizado;
    return resultado;
  }
}
