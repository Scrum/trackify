import fs from "fs/promises"; // Подключаем модуль fs для работы с файлами
import path from "path";
import { imwrite } from "@u4/opencv4nodejs"; // Импортируем imwrite из OpenCV
import Logger from "./Logger";
import PathManager from "./PathManager"; // Путь к PathManager, предполагая, что он экспортируется

class FrameSaver {
  #frameIndex = 0;
  pathManager: PathManager;

  constructor(pathManager: PathManager) {
    this.pathManager = pathManager;
  }

  async saveFrame(frame: any): Promise<void> {
    const framePath = this.pathManager.getFilePath(
      `frame_${this.#frameIndex++}.jpg`
    );
    await this.#writeFrame(framePath, frame);
  }

  private async #writeFrame(framePath: string, frame: any): Promise<void> {
    try {
      await fs.mkdir(path.dirname(framePath), { recursive: true });
      // Сохраняем кадр
      imwrite(framePath, frame);
      Logger.log(`Кадр успешно сохранен: ${framePath}`, Logger.logLevels.info);
    } catch (error) {
      Logger.log("Ошибка при сохранении кадра", Logger.logLevels.error, error);
    }
  }
}

export default FrameSaver;
