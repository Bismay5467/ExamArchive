import { Viewer, Worker } from '@react-pdf-viewer/core';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PDF_WORKER_URL } from '@/constants/shared';

export function PDFViewer({ pdfURL }: { pdfURL: string }) {
  const fullScreenPluginInstance = fullScreenPlugin();
  const { EnterFullScreenButton } = fullScreenPluginInstance;
  return (
    <Worker workerUrl={PDF_WORKER_URL}>
      <div className="h-[750px] drop-shadow-lg ">
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#f7f7f7',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <EnterFullScreenButton />
        </div>
        <Viewer fileUrl={pdfURL} plugins={[fullScreenPluginInstance]} />
      </div>
    </Worker>
  );
}
