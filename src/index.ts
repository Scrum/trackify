import VideoProcessor from "./VideoProcessor";
import KeypointVisualizer from "./KeypointVisualizer";
import Logger from "./Logger";

// Устанавливаем уровни логирования
Logger.enabledLevels = [Logger.logLevels.info, Logger.logLevels.error];

const VIDEO_PATH = "./GX010064-420-trim.mov";

// Создаем экземпляр VideoProcessor и запускаем обработку видео
const videoProcessor = new VideoProcessor(VIDEO_PATH);
videoProcessor.process().then(() => {
  // После завершения обработки видео, создаем экземпляр KeypointVisualizer и визуализируем ключевые точки
  const keypointVisualizer = new KeypointVisualizer(VIDEO_PATH);
  keypointVisualizer.visualize();
});
