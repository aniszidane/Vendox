// VendoX Backend — app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { PostsModule } from './posts/posts.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { SavesModule } from './saves/saves.module';
import { FollowsModule } from './follows/follows.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MapModule } from './map/map.module';
import { KhasniModule } from './khasni/khasni.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    StoresModule,
    PostsModule,
    ProductsModule,
    ServicesModule,
    CommentsModule,
    LikesModule,
    SavesModule,
    FollowsModule,
    NotificationsModule,
    MapModule,
    KhasniModule,
    ReportsModule,
    AdminModule,
    UploadModule,
    SearchModule,
  ],
})
export class AppModule {}
