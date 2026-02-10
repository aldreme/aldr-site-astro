"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogOverlay,
  DialogPortal
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface GalleryMasonryProps {
  images: GalleryImage[];
}

export default function GalleryMasonry({ images }: GalleryMasonryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <motion.div
            key={image.src}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
            onClick={() => handleImageClick(image)}
          >
            <div className={cn("relative", !imageLoaded[image.src] && "min-h-[200px]")}>
              {!imageLoaded[image.src] && (
                <Skeleton className="absolute inset-0 w-full h-full z-10" />
              )}
              <img
                src={image.src}
                alt={image.alt}
                className={cn(
                  "w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105",
                  !imageLoaded[image.src] ? "opacity-0" : "opacity-100"
                )}
                loading="lazy"
                width={image.width}
                height={image.height}
                onLoad={() => setImageLoaded(prev => ({ ...prev, [image.src]: true }))}
                ref={(el) => {
                  if (el?.complete && !imageLoaded[image.src]) {
                    setImageLoaded(prev => ({ ...prev, [image.src]: true }));
                  }
                }}
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center z-20">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                <Maximize2 size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/70 backdrop-blur-xl z-100 cursor-zoom-out" />

          {/* Custom Close Button - Fixed at top right for easy access */}
          <div className="fixed top-6 right-6 z-110 animate-in fade-in zoom-in duration-300">
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-110 active:scale-95"
              >
                <X size={28} />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          {/* Using DialogPrimitive.Content to avoid the built-in close button in the UI component */}
          {/* inset-0 + flex allows clicking anywhere outside the image to trigger the Content's onClick */}
          <DialogPrimitive.Content
            className="fixed inset-0 z-101 flex items-center justify-center focus-visible:outline-none"
            onClick={() => setIsModalOpen(false)}
          >
            <DialogPrimitive.Title className="sr-only">{selectedImage?.alt || 'Image Preview'}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">High resolution preview of the product</DialogPrimitive.Description>

            <AnimatePresence mode="wait">
              {selectedImage && (
                <motion.div
                  key={selectedImage.src}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative group max-w-[95vw] max-h-[90vh] flex flex-col items-center"
                >
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-shadow duration-500 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white text-center shadow-lg cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-sm font-semibold tracking-wide uppercase drop-shadow-sm">{selectedImage.alt}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
