/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react';

export default function NoResults() {
  const [loaded, setloaded] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-y-3 font-natosans text-lg justify-center items-center">
      <img
        width={400}
        height={300}
        src="https://res.cloudinary.com/dzorpsnmn/image/upload/v1719865549/EXAM-ARCHIVE-ASSETS/fdixjd7edbsqna7jow4c.jpg"
        alt="Not found"
        onLoad={() => setloaded(true)}
      />
      {loaded === true && (
        <>
          <p className="dark:text-slate-400 text-slate-800 text-sm text-center sm:text-medium">
            Couldn't find any results with the specified tag(s)
          </p>
          <p className="text-slate-500 text-sm text-center sm:text-medium">
            Try searching for something else, or try with a different spelling
          </p>
        </>
      )}
    </div>
  );
}
