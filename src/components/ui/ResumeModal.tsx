'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/components/ui/dialog';
import Image from 'next/image';
import { FileText, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { siteConfig } from '@/src/constants/site-config';
import { cn } from '@/src/lib/utils';

interface ResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RESUME_PAGES = [
  { src: '/resume-page-1.png', page: 1 },
  { src: '/resume-page-2.png', page: 2 },
];

export default function ResumeModal({ open, onOpenChange }: ResumeModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 75));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'p-4 md:p-6 bg-card border-border flex flex-col transition-all duration-300',
          isFullscreen
            ? 'fixed inset-0 w-screen h-screen max-w-none sm:max-w-none md:max-w-none lg:max-w-none rounded-none border-0 z-50 top-0 left-0 translate-x-0 translate-y-0'
            : 'w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl h-[94vh] rounded-2xl'
        )}
      >
        <DialogHeader className="border-b border-border/60 pb-3 text-left shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
            <div>
              <DialogTitle className="text-xl md:text-2xl font-extrabold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {siteConfig.name} — Resume
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">
                {siteConfig.role}
              </DialogDescription>
            </div>

            {/* Controls: Zoom & Fullscreen */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Zoom Controls */}
              <div className="flex items-center border border-border/80 rounded-xl bg-muted/40 p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Zoom Out"
                  disabled={zoomLevel <= 75}
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <span className="text-[11px] font-mono px-2 text-muted-foreground select-none">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Zoom In"
                  disabled={zoomLevel >= 160}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
                {zoomLevel !== 100 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResetZoom}
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer border-l border-border/60"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Fullscreen Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 gap-1.5 text-xs rounded-xl cursor-pointer hover:border-primary/50"
                title={isFullscreen ? 'Exit Full Screen' : 'View Full Screen'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-primary" />
                    <span>Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                    <span>Full Screen</span>
                  </>
                )}
              </Button>

              <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                2 Pages
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable High-Definition Resume Canvas */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-auto min-h-0 pt-4 pb-6 space-y-6 flex flex-col items-center">
          {RESUME_PAGES.map((item) => (
            <div
              key={item.page}
              style={{
                width: isFullscreen ? `${Math.min(zoomLevel, 140)}%` : `${zoomLevel}%`,
                maxWidth: isFullscreen ? '1200px' : '980px',
              }}
              className="relative rounded-xl overflow-hidden border border-border shadow-xl bg-white transition-all duration-150 shrink-0"
            >
              {/* Page Indicator Badge */}
              <div className="absolute top-3 right-3 z-10 text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/75 text-white backdrop-blur-xs font-medium">
                Page {item.page} of {RESUME_PAGES.length}
              </div>

              <Image
                src={item.src}
                alt={`${siteConfig.name} Resume Page ${item.page}`}
                width={1400}
                height={1980}
                className="w-full h-auto object-contain block select-none"
                priority={item.page === 1}
                quality={100}
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
