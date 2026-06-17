// Background YouTube Audio Player manager mimicking the WebAudioWeddingSynth interface.
// This allows other components (like ScratchReveal) to control and play the music seamlessly.

export class WebAudioWeddingSynth {
  private player: any = null;
  private isReady: boolean = false;
  private playing: boolean = false;
  private currentTrack: number = 0;
  private volumeLevel: number = 0.3; // 0.0 to 1.0
  private shouldPlayOnReady: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initYouTubeAPI();
    }
  }

  private initYouTubeAPI() {
    // 1. Create player container hidden off-screen in DOM
    let container = document.getElementById('youtube-audio-player');
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-audio-player';
      container.style.position = 'fixed';
      container.style.width = '200px';
      container.style.height = '200px';
      container.style.bottom = '-500px';
      container.style.left = '-500px';
      container.style.opacity = '0.01';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-9999';
      container.style.overflow = 'hidden';
      document.body.appendChild(container);
    }

    // 2. Load YouTube Iframe Player API script if not present
    if (!(window as any).YT) {
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Bind callback
      const previousOnReady = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousOnReady) previousOnReady();
        this.createPlayer();
      };
    } else {
      this.createPlayer();
    }
  }

  private createPlayer() {
    if (this.player) return;
    
    this.player = new (window as any).YT.Player('youtube-audio-player', {
      height: '200',
      width: '200',
      videoId: 'yONKKkx5Bxc',
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: 'yONKKkx5Bxc', // Required for looping single video
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0
      },
      events: {
        onReady: (event: any) => {
          this.isReady = true;
          
          // Set allow autoplay attribute on the generated iframe for permissions bypass
          const iframe = document.getElementById('youtube-audio-player');
          if (iframe) {
            iframe.setAttribute('allow', 'autoplay');
          }
          
          event.target.setVolume(this.volumeLevel * 100);
          if (this.shouldPlayOnReady) {
            event.target.playVideo();
            this.playing = true;
          }
        },
        onStateChange: (event: any) => {
          if (event.data === (window as any).YT.PlayerState.PLAYING) {
            this.playing = true;
          } else if (event.data === (window as any).YT.PlayerState.PAUSED || 
                     event.data === (window as any).YT.PlayerState.ENDED) {
            this.playing = false;
          }
        }
      }
    });
  }

  public start(trackIndex: number = 0) {
    this.currentTrack = trackIndex;
    this.shouldPlayOnReady = true;

    if (this.isReady && this.player) {
      this.player.playVideo();
      this.playing = true;
    } else {
      this.initYouTubeAPI();
    }
  }

  public stop() {
    this.shouldPlayOnReady = false;
    this.playing = false;

    if (this.isReady && this.player) {
      this.player.pauseVideo();
    }
  }

  public setVolume(val: number) {
    this.volumeLevel = val;
    if (this.isReady && this.player) {
      this.player.setVolume(val * 100);
    }
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public getTrack(): number {
    return this.currentTrack;
  }
}

export const audioInstance = typeof window !== 'undefined' ? new WebAudioWeddingSynth() : null;
export default audioInstance;
