import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/product.entity';
import { ProductService } from './product/product.service';

@Module({
  imports: [ProductModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "oms",
      entities: [Product],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController, ProductController],
  providers: [AppService],
})
export class AppModule { }
