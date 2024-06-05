import { FaHeart } from 'react-icons/fa';
import LogoBanner from '../../assets/LogoBanner.png';
import { LinkedIn } from '@/constants/shared.ts';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
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
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentYear}{' '}
          <a href="#" className="hover:underline">
            ExamArchive™
          </a>
          . Made with <FaHeart className="inline text-xl text-red-600" /> by{' '}
          <a
            className="font-semibold"
            href={LinkedIn.Arkojeet}
            target="_blank"
            rel="noreferrer"
          >
            Arkojeet
          </a>{' '}
          &{' '}
          <a
            className="font-semibold"
            href={LinkedIn.Bismay}
            target="_blank"
            rel="noreferrer"
          >
            Bismay
          </a>
        </span>
      </div>
    </footer>
  );
}
