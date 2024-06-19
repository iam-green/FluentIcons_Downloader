import { FluentIconsInfo } from '../type';
import { Download } from './download';
import { Log } from './log';

export class FluentIcons {
  static async iconList() {
    const result: FluentIconsInfo[] = [];
    const data = await fetch(
      'https://raw.githubusercontent.com/coltongriffith/fluenticons/main/regular.json',
    );
    for (const icon of await data.json())
      for (const type of ['outlined', 'filled']) {
        if (type == 'filled')
          icon.svgFileName = icon.svgFileName.replace('regular', 'filled');
        result.push({
          type: type as 'outlined' | 'filled',
          name: icon.name,
          url: `https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/${icon.name
            .replace(/([A-Z])/g, ' $1')
            .trim()}/SVG/${icon.svgFileName}`,
        });
      }
    return result;
  }

  static async downloadIcons(location: string) {
    const list = await FluentIcons.iconList();
    for (const { type, name, url } of list) {
      const buffer = await Download.buffer(url);
      if (!buffer) continue;
      const path = `${location}/${type}/${name}.svg`;
      await Download.saveBuffer(path, buffer.buffer);
      Log.info(`Download to '\u001B[32m${path}\u001B[0m'`, true);
    }
  }
}
