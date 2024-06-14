import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PDF_WORKER_URL } from '@/constants/shared';

export function PDFViewer({ pdfURL }: { pdfURL: string }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Worker workerUrl={PDF_WORKER_URL}>
      <div className="h-[750px] drop-shadow-lg">
        <Viewer fileUrl={pdfURL} plugins={[defaultLayoutPluginInstance]} />
      </div>
    </Worker>
  );
}
