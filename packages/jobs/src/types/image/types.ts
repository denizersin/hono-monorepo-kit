/**
 * Image Processing Job Data Interface
 */
export interface ImageJobData {
  imageUrl: string;
  operations: {
    resize?: { width: number; height: number };
    crop?: { x: number; y: number; width: number; height: number };
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
  };
  outputPath: string;
}
