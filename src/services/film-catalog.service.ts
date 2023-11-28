import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmCatalogEntity } from '../entity/film-catalog.entity';
import { Repository } from 'typeorm';
import { CreateFilmDto } from '../controllers/film-catalog/dto/create-film.dto';
import { UpdateFilmDto } from '../controllers/film-catalog/dto/update-film.dto';

@Injectable()
export class FilmCatalogService {
  constructor(
    @InjectRepository(FilmCatalogEntity)
    private readonly filmCatalogRepository: Repository<FilmCatalogEntity>,
  ) {}

  async findAll() {
    return await this.filmCatalogRepository.find({
      select: [
        'id',
        'name',
        'year',
        'genre',
        'director',
        'duration',
        'synopsis',
      ],
    });
  }

  async findOne(id: string) {
    const film = await this.filmCatalogRepository.findOne({ where: { id } });
    if (!film) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }
    return film;
  }

  async create(data: CreateFilmDto) {
    const filmCatalog = this.filmCatalogRepository.create(data);
    return this.filmCatalogRepository.save(filmCatalog);
  }

  async update(id: string, data: UpdateFilmDto) {
    const filmCatalog = await this.filmCatalogRepository.findOne({
      where: { id: id },
    });
    if (!filmCatalog) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    this.filmCatalogRepository.merge(filmCatalog, data);
    return this.filmCatalogRepository.save(filmCatalog);
  }

  async remove(id: string) {
    const filmCatalog = await this.filmCatalogRepository.findOne({
      where: { id: id },
    });
    if (!filmCatalog) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return this.filmCatalogRepository.softDelete(id);
  }
}
