import { useParams } from 'react-router-dom';

export default function Preview() {
  const { paperid } = useParams();
  return (
    <section className="min-h-[600px] grid grid-cols-6">
      <div className="bg-slate-200 col-span-4">
        <div className="bg-slate-100 min-h-[200px]">
          <p>Showing results for paper id: {paperid}</p>
        </div>
        <div className="min-h-[600px] bg-pink-200"></div>
        <div className="min-h-[500px] bg-blue-200"></div>
      </div>
      <aside className="bg-yellow-100 col-span-2"></aside>
    </section>
  );
}
