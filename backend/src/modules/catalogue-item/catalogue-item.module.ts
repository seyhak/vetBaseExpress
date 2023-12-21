import { Module } from '@nestjs/common';
import { CatalogueItemController } from './catalogue-item.controller';
// import { CatsService } from './cats.service';

@Module({
  controllers: [CatalogueItemController],
  // providers: [CatsService],
  // exports: [CatsService]
})
export class CatsModule {}
