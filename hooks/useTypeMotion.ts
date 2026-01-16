
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useEffect } from 'react';
import { AppState } from '../types';
import { generateTextImage, generateTextVideo, generateStyleSuggestion } from '../services/geminiService';
import { IMAGE_GEN_STEPS, VIDEO_GEN_STEPS } from '../constants';
import { getRandomStyle, fileToBase64, createGifFromVideo, convertVideoToWebM } from '../utils';

export const useTypeMotion = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [inputText, setInputText] = useState<string>("");
  const [inputStyle, setInputStyle] = useState<string>("");
  const [typographyPrompt, setTypographyPrompt] = useState<string>("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('720p');
  const [selectedStyleCategory, setSelectedStyleCategory] = useState<string>(''); // Initialized in component or here if we import categories

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [loadingStepText, setLoadingStepText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isGifGenerating, setIsGifGenerating] = useState<boolean>(false);
  const [isWebMGenerating, setIsWebMGenerating] = useState<boolean>(false);
  const [isSuggestingStyle, setIsSuggestingStyle] = useState<boolean>(false);

  // Organic progress jitter simulation
  useEffect(() => {
    if (state === AppState.GENERATING_IMAGE || state === AppState.GENERATING_VIDEO) {
      const isImageGen = state === AppState.GENERATING_IMAGE;
      const steps = isImageGen ? IMAGE_GEN_STEPS : VIDEO_GEN_STEPS;
      const progressCap = isImageGen ? 30 : 95;
      
      const stepInterval = setInterval(() => {
        setLoadingStepText(steps[Math.floor(Math.random() * steps.length)]);
      }, 3500);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= progressCap) return prev;
          const increment = Math.max(0.1, (progressCap - prev) / 50) + (Math.random() * 0.2);
          return Math.min(progressCap, prev + increment);
        });
      }, 200);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    }
  }, [state]);

  const startProcess = async (checkKey: () => Promise<boolean>, showKeyDialog: () => void) => {
    if (!inputText.trim()) return;

    const keySelected = await checkKey();
    if (!keySelected) {
      showKeyDialog();
      return;
    }

    setState(AppState.GENERATING_IMAGE);
    setProgress(5);
    setLoadingStepText("Synthesizing textures...");
    setIsGifGenerating(false);
    setIsWebMGenerating(false);
    if (videoSrc && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    setVideoSrc(null);
    setImageSrc(null);
    
    const styleToUse = inputStyle.trim() || getRandomStyle();
    
    try {
      // Determine image size based on selected resolution
      let imageSize: '1K' | '2K' | '4K' = '1K';
      if (resolution === '1080p') imageSize = '2K';
      if (resolution === '4k') imageSize = '4K';

      const { data: b64Image, mimeType } = await generateTextImage({
        text: inputText, 
        style: styleToUse,
        typographyPrompt: typographyPrompt,
        referenceImage: referenceImage || undefined,
        imageSize: imageSize
      });

      setImageSrc(`data:${mimeType};base64,${b64Image}`);
      setProgress(30);
      setState(AppState.GENERATING_VIDEO);
      setLoadingStepText("Simulating physics...");
      
      const videoUrl = await generateTextVideo(inputText, b64Image, mimeType, styleToUse, resolution);
      setVideoSrc(videoUrl);
      setProgress(100);
      setState(AppState.PLAYING);

    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("Requested entity was not found") || msg.includes("404")) {
        showKeyDialog();
        setState(AppState.IDLE);
      } else {
        setStatusMessage(msg || "Something went wrong creating your art.");
        setState(AppState.ERROR);
      }
    }
  };

  const handleStyleSuggestion = async () => {
    setIsSuggestingStyle(true);
    const suggestion = await generateStyleSuggestion(inputText);
    if (suggestion) setInputStyle(suggestion);
    setIsSuggestingStyle(false);
  };

  const reset = () => {
    setState(AppState.IDLE);
    setVideoSrc(null);
    setImageSrc(null);
    setProgress(0);
    setIsGifGenerating(false);
    setIsWebMGenerating(false);
  };

  const handleDownloadVideo = async (format: 'mp4' | 'webm') => {
    if (!videoSrc) return;
    
    if (format === 'mp4') {
        const a = document.createElement('a');
        a.href = videoSrc;
        a.download = `typemotion-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else if (format === 'webm') {
        setIsWebMGenerating(true);
        try {
            const webmBlob = await convertVideoToWebM(videoSrc);
            const url = URL.createObjectURL(webmBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `typemotion-${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("WebM conversion failed or not supported by your browser.");
        } finally {
            setIsWebMGenerating(false);
        }
    }
  };

  const handleDownloadGif = async () => {
    if (!videoSrc) return;
    setIsGifGenerating(true);
    try {
      const gifBlob = await createGifFromVideo(videoSrc);
      const gifUrl = URL.createObjectURL(gifBlob);
      const a = document.createElement('a');
      a.href = gifUrl;
      a.download = `typemotion-${Date.now()}.gif`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(gifUrl);
    } catch (error) {
      alert("Could not generate GIF from this video.");
    } finally {
      setIsGifGenerating(false);
    }
  };

  const handleFileChange = async (file: File) => {
    const base64 = await fileToBase64(file);
    setReferenceImage(base64);
  };

  return {
    state,
    progress,
    loadingStepText,
    statusMessage,
    isGifGenerating,
    isWebMGenerating,
    isSuggestingStyle,
    inputText, setInputText,
    inputStyle, setInputStyle,
    typographyPrompt, setTypographyPrompt,
    resolution, setResolution,
    referenceImage, setReferenceImage,
    selectedStyleCategory, setSelectedStyleCategory,
    imageSrc,
    videoSrc,
    startProcess,
    handleStyleSuggestion,
    reset,
    handleDownloadVideo,
    handleDownloadGif,
    handleFileChange
  };
};
