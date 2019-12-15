import { Story } from 'entities/Story';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

export class BaseRepository {
  private repository: Repository<Story | User>;
  constructor(repository: Repository<Story | User>) {
    this.repository = repository;
  }

  async findById(id: string) {
    return this.repository.findOne(id);
  }

  async findOne(condition: Record<string, any>) {
    return this.repository.findOne(condition);
  }

  async many(condition: Record<string, any>) {
    return this.repository.find(condition);
  }

  async all() {
    return this.repository.find();
  }

  async save(data: Record<string, any>) {
    return this.repository.save(data);
  }

  async update(id: string | number, data: Record<string, any>) {
    return this.repository.update(id, data);
  }
}
