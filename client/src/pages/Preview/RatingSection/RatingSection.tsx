/* eslint-disable function-paren-newline */
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'sonner';
import { IoIosStarOutline } from 'react-icons/io';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { KeyedMutator } from 'swr';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateRatingObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';
import { KEY_CODES } from '@/constants/shared';
import { IsUserAuthenticated } from '@/utils/helpers';

export default function RatingSection({
  postId,
  rating,
  ratingCount,
  mutate,
}: {
  ratingCount: number;
  postId: string;
  rating: Array<{
    ratingType: string;
    totalRating: number;
    averageRating: number;
    _id: string;
  }>;
  mutate: KeyedMutator<any>;
}) {
  const [helpfull, setHelpfull] = useState<number>(0);
  const [standard, setStandard] = useState<number>(0);
  const [relevance, setRelevance] = useState<number>(0);
  const [
    { averageRating: helpfullRate },
    { averageRating: standardRate },
    { averageRating: relevanceRate },
  ] = rating;

  const {
    authState: { jwtToken, isAuth },
  } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const getRatingCount = () => {
    // eslint-disable-next-line no-magic-numbers
    if (ratingCount > 1000) return `${Math.floor(ratingCount / 1000)}K+ users`;
    if (ratingCount > 1) return `${ratingCount} users`;
    return `${ratingCount} user`;
  };

  const handleSubmit = async () => {
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
    if (!helpfull || !standard || !relevance) {
      toast.error('Please rate all the fields!', {
        duration: 5000,
      });
      return;
    }
    onClose();
    const reqObject = updateRatingObj(
      {
        postId,
        ratingArray: [
          { type: 'HELPFUL', value: helpfull },
          { type: 'STANDARD', value: standard },
          { type: 'RELEVANCE', value: relevance },
        ],
      },
      jwtToken
    );
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    try {
      await fetcher(reqObject);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      return;
    }
    mutate().then(() =>
      toast.success('Thank you for your feedback!', {
        duration: 5000,
      })
    );
  };

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === KEY_CODES.ENTER) handleSubmit();
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <p className="self-center dark:text-slate-500 text-slate-900">
          Ratings{' '}
          <span className="text-slate-500">
            {`( ${getRatingCount()} voted )`}
          </span>
        </p>
        <Button
          size="sm"
          radius="sm"
          className="text-small bg-transparent text-blue-500"
          onPress={onOpen}
        >
          Rate Here
        </Button>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 sm:gap-x-4 gap-y-2 w-fit dark:text-slate-400 text-slate-700">
        <p>Helpful</p>
        <Rating
          name="helpful-read-only"
          value={parseFloat(helpfullRate.toFixed(1))}
          precision={0.1}
          readOnly
          emptyIcon={<StarIcon style={{ color: 'grey' }} fontSize="inherit" />}
        />
        <p className="text-center sm:text-left">
          {parseFloat(helpfullRate.toFixed(1))} / 5
        </p>
        <p>Standard</p>
        <Rating
          name="standard-read-only"
          value={parseFloat(standardRate.toFixed(1))}
          precision={0.1}
          readOnly
          emptyIcon={<StarIcon style={{ color: 'grey' }} fontSize="inherit" />}
        />
        <p className="text-center sm:text-left">
          {parseFloat(standardRate.toFixed(1))} / 5
        </p>
        <p>Relevance</p>
        <Rating
          name="relevance-read-only"
          value={parseFloat(relevanceRate.toFixed(1))}
          precision={0.1}
          readOnly
          emptyIcon={<StarIcon style={{ color: 'grey' }} fontSize="inherit" />}
        />
        <p className="text-center sm:text-left">
          {parseFloat(relevanceRate.toFixed(1))} / 5
        </p>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        onKeyDown={handleKeyEvent}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        radius="sm"
        className="font-natosans"
      >
        <ModalContent className="w-fit">
          {() => (
            <>
              <ModalHeader className="flex flex-row gap-x-2">
                <IoIosStarOutline className="self-center text-2xl" />
                <p className="text-lg">Rate this paper</p>
              </ModalHeader>
              <ModalBody>
                <p className="mt-1 mb-2 dark:text-slate-500 text-slate-700">
                  Let us know how you feel about this paper!
                </p>
                <div className="grid grid-cols-2 grid-rows-3 gap-y-2 w-fit">
                  <h3>Helpful :</h3>
                  <Rating
                    name="helpfull-controlled"
                    value={helpfull}
                    onChange={(_, newValue) => {
                      setHelpfull(newValue || 0);
                    }}
                    emptyIcon={
                      <StarIcon style={{ color: 'grey' }} fontSize="inherit" />
                    }
                  />
                  <h3>Standard :</h3>
                  <Rating
                    name="standard-controlled"
                    value={standard}
                    onChange={(_, newValue) => {
                      setStandard(newValue || 0);
                    }}
                    emptyIcon={
                      <StarIcon style={{ color: 'grey' }} fontSize="inherit" />
                    }
                  />
                  <h3>Relevance :</h3>
                  <Rating
                    name="relevance-controlled"
                    value={relevance}
                    onChange={(_, newValue) => {
                      setRelevance(newValue || 0);
                    }}
                    emptyIcon={
                      <StarIcon style={{ color: 'grey' }} fontSize="inherit" />
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  radius="sm"
                  variant="bordered"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  radius="sm"
                  variant="bordered"
                  onPress={handleSubmit}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
