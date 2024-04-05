import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: "localhost:5010", 
      protoPath: "src/protos/product.proto",
      package: "oms"
    }
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
