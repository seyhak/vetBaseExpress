import { Module } from '@nestjs/common';
import { CatalogueItemController } from './catalogue-item.controller';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
// import { CatsService } from './cats.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  // exports: [CatsService]
})
export class CategoryModule {}
