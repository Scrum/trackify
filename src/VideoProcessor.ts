import { VideoCapture, Mat } from "@u4/opencv4nodejs";
import PathManager from "./PathManager";
import FrameSaver from "./FrameSaver";
import KeypointExtractor from "./KeypointExtractor";
import Logger from "./Logger";

class VideoProcessor {
  private videoCapture: VideoCapture;
  private frameSaver: FrameSaver;
  private keypointExtractor: KeypointExtractor;

  constructor(videoPath: string) {
    this.videoCapture = new VideoCapture(videoPath);
    this.frameSaver = new FrameSaver(new PathManager("frames"));
    this.keypointExtractor = new KeypointExtractor();
  }

  private async *frameGenerator(): AsyncGenerator<Mat> {
    let frame: Mat;
    while ((frame = this.videoCapture.read()) && !frame.empty) {
      yield frame;
    }
  }

  public async process(): Promise<void> {
    const framePromises: Promise<void>[] = [];
    for await (const frame of this.frameGenerator()) {
      framePromises.push(this.processFrame(frame));
    }
    await Promise.all(framePromises);
    await this.keypointExtractor.saveKeypoints();
  }

  private async processFrame(frame: Mat): Promise<void> {
    await this.frameSaver.saveFrame(frame);
    this.keypointExtractor.extract(frame);
  }
}

export = VideoProcessor;
