import Comments from './Comments/Comments';
import PreviewContent from './PreviewContent/PreviewContent';

export default function Preview() {
  return (
    <section className="min-h-[600px] max-w-[1280px] mx-auto">
      <PreviewContent />
      <Comments />
    </section>
  );
}
