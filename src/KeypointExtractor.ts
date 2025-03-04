import { ORBDetector } from "@u4/opencv4nodejs";
import fs from "fs/promises";
import path from "path";
import PathManager from "./PathManager";
import Logger from "./Logger";

interface Keypoint {
  x: number;
  y: number;
}

class KeypointExtractor {
  private #keypointsData: Keypoint[][] = [];
  private pathManager: PathManager;
  private detector: ORBDetector;

  constructor() {
    this.pathManager = new PathManager("keypoints");
    this.detector = new ORBDetector();
  }

  extract(frame: any): void {
    const keypoints = this.detector.detect(frame);
    this.#keypointsData.push(
      keypoints.map((kp) => ({ x: kp.pt.x, y: kp.pt.y }))
    );
  }

  async saveKeypoints(): Promise<void> {
    const keypointsPath = this.pathManager.getFilePath("keypoints.json");
    await this.pathManager.saveFile(
      keypointsPath,
      JSON.stringify(this.#keypointsData, null, 2)
    );
  }

  async loadKeypoints(keypointsPath: string): Promise<Keypoint[][]> {
    try {
      await fs.access(path.dirname(keypointsPath)); // Проверка существования директории
      const keypointsData = await fs.readFile(keypointsPath, "utf8");
      return JSON.parse(keypointsData);
    } catch (error) {
      Logger.log(
        "Ошибка при загрузке ключевых точек",
        Logger.logLevels.error,
        error
      );
      throw error; // Повторно выбрасываем ошибку после логирования
    }
  }
}

export default KeypointExtractor;
