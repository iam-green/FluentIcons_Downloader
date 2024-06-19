import dotenv from 'dotenv';
import { FluentIcons } from './module';

dotenv.config();

async function bootstrap() {
  await FluentIcons.downloadIcons(process.env.ICON_ASSET_EXPORT || './output');
}

bootstrap();
