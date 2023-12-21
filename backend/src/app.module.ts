import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true
    })
  ]
})
