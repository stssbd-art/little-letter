type YtPlayer = {
  destroy: () => void;
  loadVideoById: (
    id: string | { videoId: string; startSeconds?: number }
  ) => void;
  cueVideoById: (
    id: string | { videoId: string; startSeconds?: number }
  ) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
};

type YtNamespace = {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: YtPlayer }) => void;
        onStateChange?: (event: { data: number; target: YtPlayer }) => void;
        onError?: () => void;
      };
    }
  ) => YtPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
};

declare global {
  interface Window {
    YT?: YtNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YtNamespace> | null = null;

export function loadYouTubeApi(): Promise<YtNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API is client-only."));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const finish = () => {
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube API failed to load."));
    };

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      finish();
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.onerror = () => reject(new Error("Could not load YouTube."));
      document.body.appendChild(tag);
    } else if (window.YT?.Player) {
      // Script already loaded and ready before our callback was set
      finish();
    } else {
      // Script present but not ready yet — poll briefly as a fallback
      let tries = 0;
      const poll = window.setInterval(() => {
        tries += 1;
        if (window.YT?.Player) {
          window.clearInterval(poll);
          finish();
        } else if (tries > 40) {
          window.clearInterval(poll);
          reject(new Error("YouTube API timed out."));
        }
      }, 100);
    }
  });

  return apiPromise;
}

export type { YtPlayer, YtNamespace };
