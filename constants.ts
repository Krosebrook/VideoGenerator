
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Video } from './types';

const staticFilesUrl = 'https://www.gstatic.com/aistudio/starter-apps/type-motion/';

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: "Cloud Formations",
    videoUrl: staticFilesUrl + 'clouds_v2.mp4',
    description: "Text formed by fluffy white clouds in a deep blue summer sky.",
  },
  {
    id: '2',
    title: "Elemental Fire",
    videoUrl: staticFilesUrl + 'fire_v2.mp4',
    description: "Flames erupt into text in an arid dry environment.",
  },
  {
    id: '3',
    title: "Mystic Smoke",
    videoUrl: staticFilesUrl + 'smoke_v2.mp4',
    description: "A sudden wave of smoke swirling to reveal the text.",
  },
  {
    id: '4',
    title: "Water Blast",
    videoUrl: staticFilesUrl + 'water_v2.mp4',
    description: "A wall of water punching through text with power.",
  },
];

export const IMAGE_GEN_STEPS = [
  "Dreaming textures...",
  "Synthesizing latent space...",
  "Baking 3D lighting...",
  "Calibrating typography..."
];

export const VIDEO_GEN_STEPS = [
  "Simulating physics...",
  "Interpolating temporal frames...",
  "Upscaling motion vectors...",
  "Finalizing cinematic sequence..."
];

export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Type Motion',
    content: 'Transform your words into cinematic 3D reveals. Let\'s walk through how to create your first masterpiece.',
    selector: null,
  },
  {
    id: 'message',
    title: 'The Message',
    content: 'Start by typing the word or phrase you want to animate. Short, bold words usually create the most impact.',
    selector: '[data-tour="message-input"]',
  },
  {
    id: 'style',
    title: 'Visual Environment',
    content: 'Describe the world where your text lives. Use our curated presets or click "AI Suggest" for instant inspiration.',
    selector: '[data-tour="style-input"]',
  },
  {
    id: 'typography',
    title: 'Typography Mood',
    content: 'The font style sets the tone. Choose a classic serif for luxury or glowing neon for a futuristic vibe.',
    selector: '[data-tour="typo-input"]',
  },
  {
    id: 'reference',
    title: 'Visual Reference',
    content: 'Optional: Upload an image to guide the AI\'s color palette and lighting for perfect art direction.',
    selector: '[data-tour="reference-input"]',
  },
  {
    id: 'resolution',
    title: 'Cinematic Quality',
    content: 'Choose from 720p for fast previews up to 4K for ultra-high-definition master files.',
    selector: '[data-tour="resolution-selector"]',
  },
  {
    id: 'generate',
    title: 'Launch Generation',
    content: 'Ready? Hit generate. Our system will first synthesize a 1K keyframe and then animate the cinematic transition.',
    selector: '[data-tour="generate-btn"]',
  }
];
