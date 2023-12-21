import { Injectable } from '@nestjs/common';
import { Category } from '../../types/category';

@Injectable()
export class CategoryService {
  private readonly categories: Category[] = [];

  async create(cat: Category) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}