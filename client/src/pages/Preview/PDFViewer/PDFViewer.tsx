import { Viewer, Worker } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import { PDF_WORKER_URL } from '@/constants/shared';

export function PDFViewer({ pdfURL }: { pdfURL: string }) {
  const fullScreenPluginInstance = fullScreenPlugin();
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;
  const { EnterFullScreenButton } = fullScreenPluginInstance;
  return (
    <Worker workerUrl={PDF_WORKER_URL}>
      <div className="bg-[#f7f7f7] flex flex-row justify-end items-center rounded-t-lg">
        <ZoomInButton />
        <ZoomOutButton />
        <EnterFullScreenButton />
      </div>
      <div className="h-[700px] sm:h-[750px] drop-shadow-lg overflow-y-hidden">
        <Viewer
          fileUrl={pdfURL}
          plugins={[zoomPluginInstance, fullScreenPluginInstance]}
        />
      </div>
    </Worker>
  );
}
