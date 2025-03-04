import { parentPort, workerData } from "worker_threads";
import { ORBDetector, Mat } from "@u4/opencv4nodejs";

const detector = new ORBDetector();

try {
  // Проверяем, что кадр является объектом Mat
  if (workerData.frame && workerData.frame instanceof Mat) {
    const keypoints = detector.detect(workerData.frame);
    const keypointsData = keypoints.map((kp) => ({
      x: kp.pt.x,
      y: kp.pt.y,
    }));

    parentPort?.postMessage(keypointsData);
  } else {
    throw new Error("Передан некорректный кадр. Ожидается объект Mat.");
  }
} catch (error) {
  // Отправляем ошибку через рабочий поток
  parentPort?.postMessage({ error: error.message });
}
