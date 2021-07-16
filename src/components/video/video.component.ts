import { Component, OnInit } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  videoSrc: File | null = null;
  bolbList: string[] = [];

  constructor() {}

  ngOnInit() {}

  ffmpeg = createFFmpeg({
    log: true,
    logger: (options) => console.log('logger: ', options),
    progress: (options) => console.log('progress: ', options)
  });

  doDecode = async () => {
    console.log(this.videoSrc);
    if (this.videoSrc) {
      await this.ffmpeg.load();
      const video = this.videoSrc;
      if (video) {
        this.ffmpeg.FS('writeFile', `in_%02d.mp4`, await fetchFile(video));

        /**
         * !! for -qscale:v flag
         * https://stackoverflow.com/questions/10225403/how-can-i-extract-a-good-quality-jpeg-image-from-a-video-file-with-ffmpeg
         **/
        // await ffmpeg.run('-i', `in_%02d.mp4`, '-qscale:v', '2', '-vf', 'fps=1', `out_%03d.jpg`);
        await this.ffmpeg.run(
          '-i',
          `in_%02d.mp4`,
          '-qscale:v',
          '2',
          // '-vf',
          // 'fps=1',
          // '-frame_pts',
          // 'true',
          '-vf',
          'fps=30',
          `out_%03d.jpg`
          // '>',
          // 'log.txt',
        );
        // setMessage('Complete decoding');

        for (let m = 1; ; m++) {
          try {
            const indexCount = String(m).padStart(3, '0');
            const data = this.ffmpeg.FS('readFile', `out_${indexCount}.jpg`);
            const url = URL.createObjectURL(
              new Blob([data.buffer], { type: 'image/jpg' })
            );
            this.ffmpeg.FS('unlink', `out_${indexCount}.jpg`);
            this.bolbList.push(url);
          } catch (e) {
            // exit the loop
            break;
          }
        }
      }
    }
  };

  handleFileInput(event: any) {
    // if (!event.target.files) return;
    this.videoSrc = event.target.files.item(0);
  }
}
