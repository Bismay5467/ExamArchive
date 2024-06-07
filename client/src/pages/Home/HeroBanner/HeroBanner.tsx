import { FaCheckCircle, FaChevronRight } from 'react-icons/fa';

import { Button } from '@/components/ui/button.tsx';
import ChatBox from './ChatBox.tsx';
import { TypewriterEffect } from '@/components/ui/typewriter-effect.tsx';
import heroImg from '../../../assets/HeroImage.jpg';

export default function HeroBanner() {
  const words = [
    {
      text: 'Exam',
      className: 'text-blue-500 text-[80px] dark:text-blue-500',
    },
    {
      text: 'Archive',
      className: 'text-blue-500 text-[80px] dark:text-blue-500',
    },
    {
      text: 'is',
    },
    {
      text: 'your',
    },
    {
      text: 'one',
    },
    {
      text: 'stop',
    },
    {
      text: 'solution',
    },
    {
      text: 'for',
    },
    {
      text: 'PYQs',
      className: 'text-[45px] font-bold',
    },
  ];

  const chatBoxProps = [
    {
      bgColor: '#FFD955',
      textColor: '#000000',
      borderRadius: '20px 20px 0 20px',
      text: 'Get all questions from all papers',
      top: '150px',
      right: '-40px',
    },
    {
      bgColor: '#37D15D',
      textColor: '#FFFFFF',
      borderRadius: '20px 20px 20px 0',
      text: 'AI Powered suggestions',
      top: '250px',
      left: '-40px',
    },
    {
      bgColor: '#9149ED',
      textColor: '#FFFFFF',
      borderRadius: '20px 20px 0 20px',
      text: 'Discuss with your peers in the forum',
      top: '350px',
      right: '-40px',
    },
    {
      bgColor: '#2E9DFB',
      textColor: '#FFFFFF',
      borderRadius: '20px 20px 20px 0',
      text: 'Authentic papers from all exams around',
      top: '450px',
      left: '-40px',
    },
  ];

  return (
    <section className=" bg-[#b1d8fc] rounded-b-[80px]">
      <div className="w-[1280px] min-h-[670px] h-full mx-auto flex flex-row">
        <div className="w-[50%] flex flex-col justify-center px-4">
          <div className="flex flex-col gap-y-6">
            <TypewriterEffect words={words} />
            <div>
              <p className="flex flex-row items-center gap-x-2 text-gray-500">
                <FaCheckCircle className="text-lg" />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta,
                saepe?
              </p>
              <p className="flex flex-row items-center gap-x-2 text-gray-500">
                <FaCheckCircle className="text-lg" />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta,
                saepe?
              </p>
            </div>
            <Button className="max-w-[300px] rounded-3xl">
              Get Started
              <FaChevronRight className="w-6" />
            </Button>
          </div>
        </div>
        <div className="w-[50%] flex flex-col relative justify-center">
          <img
            src={heroImg}
            alt="Hero"
            className="rounded-tl-[80px] rounded-br-[80px]"
          />

          {chatBoxProps.map((props, idx) => (
            <ChatBox key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
