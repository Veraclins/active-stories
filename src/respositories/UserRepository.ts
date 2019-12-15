import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository {
  constructor(repository: any) {
    super(repository);
  }
  private userRepository = getRepository(User);

  async query(field: string, fieldData: Object) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(`user.${field} = :${field}`, fieldData)
      .getOne();
  }
}
