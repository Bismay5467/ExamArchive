/* eslint-disable react/no-unescaped-entities */
import { Image, Card, CardHeader, CardBody } from '@nextui-org/react';

const testimonials = [
  {
    avatarImg: 'https://avatars.githubusercontent.com/u/58584158?v=4',
    description:
      'Exam Archive is a fantastic resource for accessing previous year question papers across various exams. The bookmark feature allows me to save important papers for quick access later, and the moderation ensures high-quality, relevant content. Highly recommended for efficient and effective exam preparation!',
    name: 'Srijita Sarkar',
    designation: 'NITK',
  },
  {
    avatarImg: 'https://avatars.githubusercontent.com/u/73980183?v=4',
    description:
      'Exam Archive has been a game-changer for my exam preparation. The ability to access previous year question papers from various exams is incredibly convenient. The bookmark feature allows me to save important papers for quick reference while the comment section fosters valuable discussions.',
    name: 'Biplaw Kumar Singh',
    designation: 'NITK',
  },
  {
    avatarImg: 'https://avatars.githubusercontent.com/u/123952063?v=4',
    description:
      'Exam Archive is a fantastic resource for exam prep. Accessing past question papers is easy, and the bookmark feature helps keep important papers handy. The comment section allows for insightful discussions with fellow students, and the moderation ensures reliable content. Highly recommended!',
    name: 'Rahul Maity',
    designation: 'NITK',
  },
];

export default function Testimonials() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Don't take our word for it</h2>
            <p className="text-xl text-gray-400">
              They say the end user's voice speeks more!
            </p>
          </div>

          {/* Testimonials */}
          <div className="max-w-sm mx-auto grid gap-8 lg:grid-cols-3 lg:gap-6 items-start lg:max-w-none">
            {testimonials.map(
              ({ avatarImg, description, designation, name }, idx) => (
                <Card
                  className="px-6 py-4 dark:bg-[#191919] text-justify"
                  data-aos="fade-up"
                  key={idx}
                >
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <div className="relative inline-flex flex-col mb-4">
                      <Image
                        className="rounded-full"
                        src={avatarImg}
                        width={48}
                        height={48}
                        alt="Testimonial img"
                      />
                      <svg
                        className="absolute top-0 right-0 -mr-3 w-6 h-5 fill-current text-purple-600"
                        viewBox="0 0 24 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 13.517c0-2.346.611-4.774 1.833-7.283C3.056 3.726 4.733 1.648 6.865 0L11 2.696C9.726 4.393 8.777 6.109 8.152 7.844c-.624 1.735-.936 3.589-.936 5.56v4.644H0v-4.531zm13 0c0-2.346.611-4.774 1.833-7.283 1.223-2.508 2.9-4.586 5.032-6.234L24 2.696c-1.274 1.697-2.223 3.413-2.848 5.148-.624 1.735-.936 3.589-.936 5.56v4.644H13v-4.531z" />
                      </svg>
                    </div>
                  </CardHeader>
                  <CardBody className="overflow-visible">
                    <blockquote className="text-base dark:text-gray-400 grow text-justify">
                      — {description}
                    </blockquote>
                    <div className="dark:text-gray-700 font-medium mt-6 pt-5 border-t dark:border-gray-700">
                      <cite className="dark:text-gray-200 text-slate-500 not-italic">
                        {name}
                      </cite>{' '}
                      -{' '}
                      <a
                        className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                        href="#0"
                      >
                        {designation}
                      </a>
                    </div>
                  </CardBody>
                </Card>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
