declare module "player.js" {
  type PlayerEvent =
    | "ready"
    | "play"
    | "pause"
    | "ended"
    | "timeupdate"
    | "error";

  interface TimeUpdateData {
    seconds: number;
    duration: number;
  }

  class Player {
    constructor(iframe: HTMLIFrameElement);

    on(event: PlayerEvent, callback: (data?: any) => void): void;
    off(event: PlayerEvent): void;

    play(): void;
    pause(): void;

    getCurrentTime(cb: (seconds: number) => void): void;
    setCurrentTime(seconds: number): void;

    getDuration(cb: (duration: number) => void): void;
  }

  export default Player;
}
