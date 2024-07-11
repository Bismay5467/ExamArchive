import { FaStarAndCrescent } from 'react-icons/fa6';
import { Highlight } from '@/components/ui/hero-highlight';
import { HoverEffect } from '@/components/ui/card-hover-effect';

export const cards = [
  {
    title: 'Stripe',
    description:
      'A technology company that builds economic infrastructure for the internet.',
    link: 'https://pornhub.com',
    icon: <FaStarAndCrescent className="text-3xl" />,
    aosDelay: 0,
  },
  {
    title: 'Netflix',
    description:
      'A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.',
    link: 'https://pornhub.com',
    icon: <FaStarAndCrescent className="text-3xl" />,
    aosDelay: 100,
  },
  {
    title: 'Google',
    description:
      'A multinational technology company that specializes in Internet-related services and products.',
    link: 'https://pornhub.com',
    icon: <FaStarAndCrescent className="text-3xl" />,
    aosDelay: 200,
  },
  {
    title: 'Meta',
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: 'https://pornhub.com',
    icon: <FaStarAndCrescent className="text-3xl" />,
    aosDelay: 300,
  },
  {
    title: 'Amazon',
    description:
      'A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    link: 'https://pornhub.com',
    icon: <FaStarAndCrescent className="text-3xl" />,
    aosDelay: 400,
  },
  {
    title: 'Microsoft',
    description:
      'A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
    link: 'https://pornhub.com',
    icon: <FaStarAndCrescent className="text-3xl" />,
    aosDelay: 500,
  },
];

export default function Features() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 mb-4 leading-snug">
              The majority of students don&apos;t understand exactly{' '}
              <Highlight className="px-2">what to study?</Highlight>
            </h2>
          </div>
          {/* Items */}
          <div
            className="max-w-sm mx-auto items-start md:max-w-2xl lg:max-w-none"
            data-aos-id-blocks
          >
            <HoverEffect items={cards} />
          </div>
        </div>
      </div>
    </section>
  );
}
