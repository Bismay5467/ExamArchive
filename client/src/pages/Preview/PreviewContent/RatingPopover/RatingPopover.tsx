/* eslint-disable indent */
import {
  Slider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react';
import { BsStars } from 'react-icons/bs';
import { BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { updateRatingObj } from '@/utils/axiosReqObjects/rating';
import { SUCCESS_CODES } from '@/constants/statusCodes';

const DEFAULT_RATING_VALUE = 2;

export default function RatingPopover({ postId }: { postId: string }) {
  const [helpfullness, setHelpfullness] =
    useState<number>(DEFAULT_RATING_VALUE);
  const [standard, setStandard] = useState<number>(DEFAULT_RATING_VALUE);
  const [relevance, setRelevance] = useState<number>(DEFAULT_RATING_VALUE);
  const [isRated, setIsRated] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    authState: { jwtToken },
  } = useAuth();

  const { data: response, error } = useSWR(
    isRated && !isOpen
      ? updateRatingObj(
          {
            postId,
            ratingArray: [
              { type: 'HELPFUL', value: helpfullness },
              { type: 'STANDARD', value: standard },
              { type: 'RELEVANCE', value: relevance },
            ],
          },
          jwtToken
        )
      : null
  );

  useEffect(() => {
    //   TODO: Chamge status code to 201 (put)
    if (response && response.status === SUCCESS_CODES.OK) {
      toast.success('Thank you for your feedback!', {
        duration: 5000,
      });
    }
    if (error) {
      toast.error(`${error.response.data.message}`, {
        duration: 5000,
      });
    }
  }, [response, error]);

  return (
    <Popover
      placement="right"
      showArrow
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button className="w-fit">
          Rate this paper? <BsStars className="text-xl text-purple-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2 pb-4 w-[400px] flex flex-col gap-y-4">
          <Slider
            label="Helpfullness?"
            showTooltip
            hideValue
            color="secondary"
            step={1}
            maxValue={5}
            minValue={0}
            defaultValue={helpfullness}
            endContent={<BiSolidLike className="text-xl" />}
            startContent={<BiSolidDislike className="text-xl" />}
            className="max-w-md font-bold text-medium text-slate-500"
            onChangeEnd={(e) => {
              setHelpfullness(e as number);
              setIsRated(true);
            }}
          />
          <Slider
            label="Standard?"
            showTooltip
            hideValue
            color="secondary"
            step={1}
            maxValue={5}
            minValue={0}
            defaultValue={standard}
            endContent={<BiSolidLike className="text-xl" />}
            startContent={<BiSolidDislike className="text-xl" />}
            className="max-w-md font-bold text-medium text-slate-500"
            onChangeEnd={(e) => {
              setStandard(e as number);
              setIsRated(true);
            }}
          />
          <Slider
            label="Relevance?"
            showTooltip
            hideValue
            color="secondary"
            step={1}
            maxValue={5}
            minValue={0}
            defaultValue={relevance}
            endContent={<BiSolidLike className="text-xl" />}
            startContent={<BiSolidDislike className="text-xl" />}
            className="max-w-md font-bold text-medium text-slate-500"
            onChangeEnd={(e) => {
              setRelevance(e as number);
              setIsRated(true);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
