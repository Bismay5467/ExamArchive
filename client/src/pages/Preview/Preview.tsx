import Comments from './Comments/Comments';
import PreviewContent from './PreviewContent/PreviewContent';

export default function Preview() {
  return (
    <section className="min-h-[600px] max-w-[1250px] bg-white p-4 mx-auto">
      <PreviewContent />
      <Comments />
    </section>
  );
}
