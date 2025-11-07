import { Injectable } from '@nestjs/common';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';

@Injectable()
export class PortafolioService {
  create(createPortafolioDto: CreatePortafolioDto) {
    return 'This action adds a new portafolio';
  }

  findAll() {
    return `This action returns all portafolio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} portafolio`;
  }

  update(id: number, updatePortafolioDto: UpdatePortafolioDto) {
    return `This action updates a #${id} portafolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} portafolio`;
  }
}
