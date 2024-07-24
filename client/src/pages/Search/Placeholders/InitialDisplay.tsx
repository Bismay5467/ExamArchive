import { useState } from 'react';

export default function InitialDisplay() {
  const [loaded, setLoaded] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-y-3 font-natosans text-lg justify-center items-center">
      <img
        width={400}
        height={300}
        src="https://res.cloudinary.com/dzorpsnmn/image/upload/v1719864150/EXAM-ARCHIVE-ASSETS/w294za0tvklwsrustgwn.jpg"
        // fallbackSrc="https://via.placeholder.com/300x200"
        alt="Search"
        onLoad={() => setLoaded(true)}
      />
      {loaded === true && (
        <>
          <p className="dark:text-slate-400 text-slate-800 text-sm text-center sm:text-medium">
            Enter comma seperated tags to see relevant results here
          </p>
          <p className="text-slate-500 text-sm text-center sm:text-medium">
            For example : paging, segmentation
          </p>
        </>
      )}
    </div>
  );
}
