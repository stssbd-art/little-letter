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
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
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

  apiPromise = new Promise<YtNamespace>((resolve, reject) => {
    let settled = false;
    const finishOk = () => {
      if (settled) return;
      if (window.YT?.Player) {
        settled = true;
        resolve(window.YT);
      }
    };
    const finishErr = (err: Error) => {
      if (settled) return;
      settled = true;
      apiPromise = null;
      reject(err);
    };

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try {
        previous?.();
      } catch {
        /* ignore prior handler errors */
      }
      finishOk();
      if (!settled) {
        finishErr(new Error("YouTube API failed to load."));
      }
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.onerror = () => finishErr(new Error("Could not load YouTube."));
      document.body.appendChild(tag);
    }

    // Poll in case the API was already loaded / callback already fired
    let tries = 0;
    const poll = window.setInterval(() => {
      tries += 1;
      if (window.YT?.Player) {
        window.clearInterval(poll);
        finishOk();
      } else if (tries > 50) {
        window.clearInterval(poll);
        finishErr(new Error("YouTube API timed out."));
      }
    }, 100);
  });

  return apiPromise;
}

export type { YtPlayer, YtNamespace };
