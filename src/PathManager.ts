import fs from 'fs/promises';
import path from 'path';
import Logger from './Logger';

class PathManager {
  private baseDir: string;
  private directoryPath: string;

  constructor(dirName: string) {
    this.baseDir = path.join(__dirname, "videos", Date.now().toString());
    this.directoryPath = path.join(this.baseDir, dirName);
    this.createDir();
  }

  private async createDir(): Promise<void> {
    try {
      await fs.mkdir(this.directoryPath, { recursive: true });
    } catch (error) {
      Logger.log("Ошибка при создании директории", Logger.logLevels.error, error);
    }
  }

  public getFilePath(fileName: string): string {
    return path.join(this.directoryPath, fileName);
  }

  public async saveFile(filePath: string, data: string | Buffer): Promise<void> {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, data);
    } catch (error) {
      Logger.log("Ошибка при записи в файл", Logger.logLevels.error, error);
    }
  }
}

export = PathManager;
