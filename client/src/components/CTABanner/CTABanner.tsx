import { TiInfo } from 'react-icons/ti';
import { IoMdClose } from 'react-icons/io';
import { useLayoutEffect, useState } from 'react';
import { Tooltip } from '@nextui-org/react';
import { CTA_BANNER_KEY } from '@/constants/shared';

export default function CTABanner() {
  const [showCTA, setShowCTA] = useState<boolean>(true);
  useLayoutEffect(() => {
    const isDisplayNoCTA = localStorage.getItem(CTA_BANNER_KEY);
    if (isDisplayNoCTA && JSON.parse(isDisplayNoCTA)) setShowCTA(false);
  });

  const handleClose = () => {
    setShowCTA(false);
    localStorage.setItem(CTA_BANNER_KEY, JSON.stringify(true));
  };
  return (
    <nav
      className={`bg-pink-600/80 p-2 sm:p-0 justify-around min-h-[40px] font-natosans ${showCTA ? 'flex' : 'hidden'}`}
    >
      <div className="flex flex-row gap-x-4">
        <TiInfo className="self-center text-3xl" />
        <p className="self-center text-xs sm:text-sm">
          ExamArchive is currently running on a free tier of servers, due to
          which the first response might be slow!
        </p>
        <div className="flex flex-row gap-x-2">
          <span className="h-[70%] self-center w-[1px] bg-slate-300" />
          <Tooltip
            content="Stop seeing this"
            radius="sm"
            placement="bottom"
            showArrow
          >
            <button
              className="self-center text-2xl"
              type="button"
              aria-label="CTA-close-btn"
              onClick={handleClose}
            >
              <IoMdClose />
            </button>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}
