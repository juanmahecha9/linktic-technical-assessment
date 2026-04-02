import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { email, password } = registerDto;

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException(
          `El usuario con email ${email} ya existe.`,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        email,
        password_hash: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);

      //-> Se elimina el password_hash para que no se devuelva en la respuesta
      delete (savedUser as any).password_hash;
      return savedUser;
    } catch (error) {
      this.logger.error('Error al registrar usuario', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        'Error interno al registrar el usuario.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }

      //-> Se compara la contraseña ingresada con el hash almacenado
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }

      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      this.logger.error('Error al iniciar sesión', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new HttpException(
        'Error interno al iniciar sesión.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //-> Se valida el token
  async validateUser(payload: any) {
    try {
      //-> Se busca el usuario por id
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
      }
      return user;
    } catch (error) {
      this.logger.error('Error al validar usuario', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        'Error interno al validar el token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
