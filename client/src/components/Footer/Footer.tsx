/* eslint-disable jsx-a11y/anchor-is-valid */
import { FaHeart } from 'react-icons/fa';
import LogoBanner from '../../assets/logo-banner-no-bg.png';
import { AnimatedTooltip } from '../ui/animated-tooltip';

const people = [
  {
    id: 1,
    name: 'Arkojeet Bera',
    designation: 'Software Engineer',
    image: 'https://avatars.githubusercontent.com/u/73406774?v=4',
    redirectURL: 'https://www.linkedin.com/in/arkojeet-bera/',
  },
  {
    id: 2,
    name: 'Bismay Purkayastha',
    designation: 'Software Engineer',
    image: 'https://avatars.githubusercontent.com/u/54050465?v=4',
    redirectURL: 'https://www.linkedin.com/in/bismay-purkayastha-4a63a6179/',
  },
  {
    id: 3,
    name: 'Biplaw Rajput',
    designation: 'Software Engineer',
    image: 'https://avatars.githubusercontent.com/u/73980183?v=4',
    redirectURL: 'https://www.linkedin.com/in/biplaw-kumar-singh-bba95a188/',
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white rounded-lg shadow-lg dark:bg-black m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="#"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img src={LogoBanner} className="w-[200px]" alt="Flowbite Logo" />
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a
                href="mailto:@contact.examarchive@gmail.com"
                className="hover:underline me-4 md:me-6"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="flex flex-col sm:flex-row text-sm text-gray-500 gap-x-2 justify-center sm:text-center dark:text-gray-400">
          <span className="self-center">
            © {currentYear} ExamArchive™ . Made with{' '}
            <FaHeart className="inline text-xl text-red-600" /> by{' '}
          </span>
          <div className="flex flex-row self-center items-center justify-center w-fit">
            <AnimatedTooltip items={people} />
          </div>
        </div>
      </div>
    </footer>
  );
}
