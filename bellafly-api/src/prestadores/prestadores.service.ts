import {
  ConflictException,
  Injectable,
  UnauthorizedException, // <-- 1. Importar
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrestadorDto } from './dto/create-prestadore.dto';
import { Prestador } from './entities/prestadore.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // <-- 2. Importar
import { LoginPrestadorDto } from './dto/login-prestador.dto'; // <-- 3. Importar

@Injectable()
export class PrestadoresService {
  constructor(
    @InjectRepository(Prestador)
    private prestadorRepository: Repository<Prestador>,
    private jwtService: JwtService, // <-- 4. Inyectar el servicio de JWT
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

    // 4. Hashear la contraseña
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

    // 7. ¡ESTA ES LA LÍNEA NUEVA Y CORRECTA!
    //    Creamos un objeto 'resultado' que tiene todo lo de 'prestadorGuardado'
    //    ...excepto la propiedad 'password'.
    const { password: _, ...resultado } = prestadorGuardado;

    // 8. Devolver el resultado (el prestador SIN la contraseña)
    return resultado;
  }
  // ... (aquí está tu método 'create' que ya hicimos) ...

  // 5. AÑADIR ESTE NUEVO MÉTODO COMPLETO
  async login(loginPrestadorDto: LoginPrestadorDto) {
    const { email, password } = loginPrestadorDto;

    // A. Buscar al usuario PDIENDO la contraseña
    // (Recuerda que la pusimos con 'select: false' en la entidad)
    const prestador = await this.prestadorRepository.findOne({
      where: { email },
      select: ['id', 'email', 'nombre', 'password'], // ¡Pedimos la password explícitamente!
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
      sub: prestador.id, // 'sub' es el estándar para el ID de usuario
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

  // ... (aquí está el resto de métodos 'findAll', 'findOne', etc.)
}
