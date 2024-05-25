export default function ResultCard({
  id,
  year,
  instituteName,
  semester,
  subjectCode,
}: {
  id: string;
  year: string;
  instituteName: string;
  semester: string;
  subjectCode: string;
}) {
  return (
    <div className="w-full border rounded-lg border-slate-400 p-4 h-[100px]">
      <p>
        <span className="font-bold">Paper Id: </span>
        {id}
        <span> ---------- </span>
        <span className="font-bold">Year: </span>
        {year}
      </p>
      <p>
        <span className="font-bold">Insttute: </span>
        {instituteName}
        <span> ---------- </span>
        <span className="font-bold">Semester: </span>
        {semester}
      </p>
      <p>
        <span className="font-bold">Subject Code: </span>
        {subjectCode}
      </p>
    </div>
  );
}
