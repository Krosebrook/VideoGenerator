
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export interface StylePreset {
  id: string;
  label: string;
  category: string;
  prompt: string;
}

export const STYLE_CATEGORIES = [
  'Nature & Elemental',
  'Digital & Futuristic',
  'Artistic & Material',
  'Surreal & Abstract'
];

export const STYLE_PRESETS: StylePreset[] = [
  // Nature & Elemental
  { id: 'cosmic', label: '✨ Cosmic', category: 'Nature & Elemental', prompt: 'written in glowing constellations against a dark nebula galaxy with cosmic dust' },
  // Fixed: added missing category property
  { id: 'natural', label: '🌿 Organic', category: 'Nature & Elemental', prompt: 'arranged using colorful autumn leaves and moss on wet forest floor' },
  { id: 'volcanic', label: '🌋 Magma', category: 'Nature & Elemental', prompt: 'erupting from glowing red molten lava and volcanic ash with floating fire sparks' },
  { id: 'coral', label: '🪸 Oceanic', category: 'Nature & Elemental', prompt: 'growing as bioluminescent coral reefs with tiny tropical fish and sea anemones' },
  { id: 'storm', label: '🌩️ Storm', category: 'Nature & Elemental', prompt: 'formed by crackling lightning bolts in a swirling supercell storm cloud at twilight' },

  // Digital & Futuristic
  { id: 'cyber', label: '🏙️ Cyber', category: 'Digital & Futuristic', prompt: 'reflected in cyberpunk neon puddles on a rainy street at night with glitch effects' },
  { id: 'vaporwave', label: '🌅 Retro', category: 'Digital & Futuristic', prompt: 'styled in 80s vaporwave aesthetic with neon sunset grids and palm silhouettes' },
  { id: 'glitch', label: '👾 Glitch', category: 'Digital & Futuristic', prompt: 'fragmented by digital glitch artifacts, data moshing, and chromatic aberration' },
  { id: 'hologram', label: '📡 Holo', category: 'Digital & Futuristic', prompt: 'projected as a flickering cyan 3D hologram with data streams and scanlines' },

  // Artistic & Material
  { id: 'steampunk', label: '⚙️ Industrial', category: 'Artistic & Material', prompt: 'arranged with intricate mechanical gears, brass pipes and steampunk machinery' },
  { id: 'minimal', label: '⚪ Minimal', category: 'Artistic & Material', prompt: 'sculpted from pure white marble in a minimalist gallery with soft shadows' },
  { id: 'origami', label: '📜 Origami', category: 'Artistic & Material', prompt: 'meticulously folded from intricate patterned washi paper in soft studio lighting' },
  { id: 'sketch', label: '✏️ Sketch', category: 'Artistic & Material', prompt: 'sketched with expressive charcoal and graphite strokes on textured vintage parchment' },
  { id: 'gold', label: '👑 Gilded', category: 'Artistic & Material', prompt: 'cast in solid molten gold with ornate baroque filigree and velvet shadows' },

  // Surreal & Abstract
  { id: 'liquid', label: '💧 Liquid', category: 'Surreal & Abstract', prompt: 'formed by bioluminescent jellyfish and water bubbles in the deep dark ocean' },
  { id: 'magical', label: '🔮 Arcane', category: 'Surreal & Abstract', prompt: 'glowing as ancient magical runes carved into a dark crystalline cave wall' },
  { id: 'glass', label: '💎 Prism', category: 'Surreal & Abstract', prompt: 'refracted through shattered crystalline glass with vibrant rainbow light dispersion' },
  { id: 'ethereal', label: '☁️ Dream', category: 'Surreal & Abstract', prompt: 'floating as soft iridescent silk ribbons in a misty, ethereal dreamscape' },
  { id: 'ink', label: '🖋️ Ink', category: 'Surreal & Abstract', prompt: 'dispersing like heavy black ink drops in a tank of clear water, forming cloud-like shapes' },
];

export const getRandomStyle = (): string => {
  return STYLE_PRESETS[Math.floor(Math.random() * STYLE_PRESETS.length)].prompt;
};

export const cleanBase64 = (data: string): string => {
  return data.replace(/^data:.*,/, '');
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const createGifFromVideo = async (videoUrl: string): Promise<Blob> => {
  if (typeof GIFEncoder !== 'function') {
    throw new Error("GIF library failed to load correctly. Please refresh the page.");
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    video.muted = true;
    
    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration || 5; 
        const width = 400; 
        let height = Math.floor((video.videoHeight / video.videoWidth) * width);
        if (height % 2 !== 0) height -= 1;

        const fps = 10;
        const totalFrames = Math.floor(duration * fps);
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) throw new Error("Could not get canvas context");

        const gif = GIFEncoder();
        
        for (let i = 0; i < totalFrames; i++) {
          await new Promise(r => setTimeout(r, 0));
          const time = i / fps;
          video.currentTime = time;
          
          await new Promise<void>((r) => {
             const timeout = setTimeout(r, 1000);
             const seekHandler = () => {
               clearTimeout(timeout);
               video.removeEventListener('seeked', seekHandler);
               r();
             };
             video.addEventListener('seeked', seekHandler);
          });
          
          ctx.drawImage(video, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          const { data } = imageData;
          
          const palette = quantize(data, 256);
          const index = applyPalette(data, palette);
          
          gif.writeFrame(index, width, height, { palette, delay: 1000 / fps });
        }
        
        gif.finish();
        const buffer = gif.bytes();
        resolve(new Blob([buffer], { type: 'image/gif' }));
      } catch (e) {
        console.error("GIF Generation Error:", e);
        reject(e);
      }
    };
    
    video.onerror = () => reject(new Error("Video load failed"));
    video.load(); 
  });
};

export const convertVideoToWebM = async (videoUrl: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    video.muted = true;

    video.onloadedmetadata = () => {
      // @ts-ignore
      const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream ? video.mozCaptureStream() : null;
      
      if (!stream) {
        return reject(new Error("Browser does not support capturing video stream"));
      }
      
      const options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm;codecs=vp8'; 
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
             options.mimeType = 'video/webm'; 
          }
      }

      try {
        const mediaRecorder = new MediaRecorder(stream, options);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };

        video.onended = () => {
          mediaRecorder.stop();
        };

        mediaRecorder.start();
        video.play().catch(reject);
      } catch (e) {
        reject(e);
      }
    };
    
    video.onerror = () => reject(new Error("Video failed to load for conversion"));
  });
};

export const TYPOGRAPHY_SUGGESTIONS = [
  { id: 'cinematic-3d', label: '3D Cinematic', prompt: 'Bold, dimensional 3D text with realistic lighting and shadows' },
  { id: 'neon-cyber', label: 'Neon Cyber', prompt: 'Glowing neon tube typography, cyberpunk aesthetic, vibrant bloom' },
  { id: 'elegant-serif', label: 'Classic Serif', prompt: 'Refined, high-contrast serif typography, luxury editorial look' },
  { id: 'bold-sans', label: 'Minimalist Bold', prompt: 'Massive, heavy sans-serif typography, geometric and impactful' },
  { id: 'handwritten', label: 'Hand-Brushed', prompt: 'Organic, flowing handwritten brush script, artistic and personal' },
  { id: 'retro-80s', label: '80s Chrome', prompt: 'Chrome-plated, synthwave style typography with horizon lines and sparkles' },
  { id: 'liquid-metal', label: 'Liquid Chrome', prompt: 'Fluid, melting chrome typography, surreal and reflective' },
  { id: 'botanical', label: 'Flora & Fauna', prompt: 'Typography intertwined with vines, flowers, and organic nature elements' },
];
