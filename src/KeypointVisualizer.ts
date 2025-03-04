import fs from "fs/promises";
import cv from "@u4/opencv4nodejs";
import path from "path";
import Logger from "./Logger";
import PathManager from "./PathManager";

interface Keypoint {
  x: number;
  y: number;
}

class KeypointVisualizer {
  private videoCapture: cv.VideoCapture;
  private keypoints: Keypoint[][] = [];
  private keypointsPath: string;

  constructor(videoPath: string) {
    this.videoCapture = new cv.VideoCapture(videoPath);
    this.keypointsPath = new PathManager("keypoints").getFilePath("keypoints.json");
    this.loadKeypointsData();
  }

  private async loadKeypointsData(): Promise<void> {
    try {
      const data = await fs.readFile(this.keypointsPath, "utf-8");
      this.keypoints = JSON.parse(data);

      // Выводим количество точек для каждого кадра
      this.keypoints.forEach((frameKeypoints, index) => {
        console.log(
          `Кадр ${index + 1}: ${frameKeypoints.length} ключевых точек`
        );
      });

      Logger.log(
        `Загружено ${this.keypoints.length} наборов точек`,
        Logger.logLevels.info
      );
    } catch (error) {
      Logger.log(
        "Ошибка при загрузке ключевых точек",
        Logger.logLevels.error,
        error
      );
    }
  }

  public visualize(): void {
    let frame: cv.Mat;
    let frameIndex = 0;

    // Цикл по кадрам видео
    while ((frame = this.videoCapture.read()) && !frame.empty) {
      if (this.keypoints[frameIndex]) {
        Logger.log(
          `Отображение точек для кадра ${frameIndex + 1}: ${
            this.keypoints[frameIndex].length
          } точек`,
          Logger.logLevels.info
        );

        // Отображение точек на кадре
        this.keypoints[frameIndex].forEach((keypoint) => {
          console.log(`Точка: x=${keypoint.x}, y=${keypoint.y}`);
          frame.drawMarker(
            new cv.Point(keypoint.x, keypoint.y),
            new cv.Scalar(0, 0, 255), // Красный цвет
            5, // Размер маркера
            cv.MARKER_CROSS // Тип маркера
          );
        });
      } else {
        Logger.log(
          `Нет ключевых точек для кадра ${frameIndex + 1}`,
          Logger.logLevels.info
        );
      }

      // Отображаем кадр с точками
      cv.imshow("Keypoints on Video", frame);
      const key = cv.waitKey(1);
      if (key === 27) break; // Выход при нажатии на Esc
      frameIndex++;
    }
  }
}

export default KeypointVisualizer;
