import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://coffeefeeling-frontend.vercel.app',
    ],
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  // 画像をdbに保存するために設定
  app.use(bodyParser.json({ limit: '50mb' })); // jsonをパースする際のlimitを設定
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // urlencodeされたボディをパースする際のlimitを設定

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
