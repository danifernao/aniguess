import errorSound from "./sounds/error.mp3";
import successSound from "./sounds/success.mp3";

class AudioManager {
  public success = new Audio(successSound);
  public error = new Audio(errorSound);

  public constructor() {
    this.success.preload = "auto";
    this.error.preload = "auto";
  }

  public preload(): void {
    this.success.load();
    this.error.load();
  }

  public playSuccess(): void {
    this.success.currentTime = 0;
    this.success.volume = 0.2;
    void this.success.play();
  }

  public playError(): void {
    this.error.currentTime = 0;
    this.error.volume = 0.6;
    void this.error.play();
  }
}

export const audioManager = new AudioManager();
