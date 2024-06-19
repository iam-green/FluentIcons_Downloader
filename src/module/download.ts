import { BufferResult, DownloadData } from '../type/download';
import { Log } from './log';
import fs from 'fs';

export class Download {
  static _isStringArray(value: any): value is string[] {
    if (!Array.isArray(value)) return false;
    return value.every((item) => typeof item === 'string');
  }

  static async buffer(data: DownloadData): Promise<BufferResult | null> {
    const isUrl = typeof data == 'string';
    const url = isUrl ? data : data.url;
    const result = await fetch(url);
    if (!result.body) return null;
    const buffer = Buffer.from(await result.arrayBuffer());
    Log.debug(`Imported Buffer from '\u001B[32m${url}\u001B[0m'`, true);
    return isUrl ? { buffer } : { ...data, buffer };
  }

  static async allBuffer(data: DownloadData[]) {
    const promises = data.map((data) => Download.buffer(data));
    return await Promise.all(promises);
  }

  static async saveBuffer(path: string, data: Buffer) {
    const dir = path.split('/').slice(0, -1).join('/');
    if (dir) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path, data);
    Log.debug(`Download to '\u001B[32m${path}\u001B[0m'`, true);
  }
}
