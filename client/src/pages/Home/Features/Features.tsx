import { FaNetworkWired } from 'react-icons/fa6';
import { FaDatabase, FaLinux } from 'react-icons/fa';
import { Highlight } from '@/components/ui/hero-highlight';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { CLIENT_ROUTES } from '@/constants/routes';

export const cards = [
  {
    title: 'Operating Systems',
    description:
      'Discover our comprehensive collection of papers on operating systems, featuring in-depth insights.',
    link: `${CLIENT_ROUTES.SEARCH}?searchParams=&subjectName=Operating+Systems`,
    icon: <FaLinux className="text-2xl " />,
    aosDelay: 300,
  },
  {
    title: 'Networking',
    description:
      'Discover our comprehensive collection of papers on computer networks, featuring in-depth insights.',
    link: `${CLIENT_ROUTES.SEARCH}?searchParams=&subjectName=Computer+Networks`,
    icon: <FaNetworkWired className="text-2xl" />,
    aosDelay: 400,
  },
  {
    title: 'DBMS',
    description:
      'Discover our comprehensive collection of papers on database management systems, featuring in-depth insights.',
    link: `${CLIENT_ROUTES.SEARCH}?searchParams=&subjectName=DBMS`,
    icon: <FaDatabase className="text-2xl" />,
    aosDelay: 500,
  },
];

export default function Features() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div
            className="max-w-3xl mx-auto text-center"
            aria-hidden="true"
            data-aos="fade-up"
            data-aos-delay="10"
          >
            <h2 className="h2 mb-4 leading-snug">
              The majority of students don&apos;t understand exactly
            </h2>
            <h2 className="h2 mb-4 leading-snug">
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
