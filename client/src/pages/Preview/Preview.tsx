import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PDFViewer } from './PDFViewer/PDFViewer';
import { getFileObj } from '@/utils/axiosReqObjects';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { IFileData } from '@/types/file';

export default function Preview() {
  const [fileData, setFileData] = useState<IFileData>();
  const { paperid } = useParams();

  const { data: response, error } = useSWR(
    paperid ? getFileObj(paperid) : null
  );

  const parseToJSON = async () => {
    const parsedData = await JSON.parse(response.data.data);
    setFileData(parsedData);
  };

  useEffect(() => {
    if (response) {
      if (response.status === SUCCESS_CODES.OK) {
        parseToJSON();
      } else {
        toast.error('Something went wrong!', {
          duration: 5000,
        });
      }
    }
    if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }
  }, [response, error]);

  return (
    <section className="min-h-[600px] max-w-[1280px] mx-auto">
      <div className=" grid grid-cols-12">
        <div className="col-span-6 p-4">
          {fileData && <PDFViewer pdfURL={fileData.file.url} />}
        </div>
        <div className="min-h-[500px] p-4 col-span-6 rounded-lg">
          <h1>
            {fileData?.subjectName} ({fileData?.subjectCode})
          </h1>
          <h3>
            <span>Semester:</span> {fileData?.semester} ({fileData?.year})
          </h3>
          <div>
            <span>Tags:</span>
            {fileData?.tags.map((val, idx) => (
              <span key={idx} className="border-2 rounded-md px-2 py-1">
                {val}
              </span>
            ))}
          </div>
          <h2>
            <span>Branch</span> {fileData?.branch}{' '}
          </h2>
          <h2>
            <span>Subject Code</span> {fileData?.subjectCode}{' '}
          </h2>
          <h3>
            <span>Institute</span> {fileData?.institutionName}{' '}
          </h3>
        </div>
      </div>
      <div className="bg-yellow-100 min-h-[300px]" />
    </section>
  );
}
