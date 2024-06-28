import Rating from '@mui/material/Rating';
import { BsStars } from 'react-icons/bs';
import { toast } from 'sonner';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import { updateRatingObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';

export default function RatingSection({
  postId,
  rating,
}: {
  postId: string;
  rating: Array<{
    ratingType: string;
    totalRating: number;
    averageRating: number;
    _id: string;
  }>;
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
    authState: { jwtToken },
  } = useAuth();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleSubmit = async () => {
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
    toast.success('Thank you for your feedback!', {
      duration: 5000,
    });
  };
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <p className="self-center">Ratings ( 1.2K+ users voted )</p>
        <Button size="sm" radius="sm" className="text-small" onPress={onOpen}>
          Rate Here
        </Button>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 sm:gap-x-4 gap-y-2 w-fit">
        <p>Helpful</p>
        <Rating
          name="helpful-read-only"
          value={parseFloat(helpfullRate.toFixed(1))}
          precision={0.1}
          readOnly
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
        />
        <p className="text-center sm:text-left">
          {parseFloat(relevanceRate.toFixed(1))} / 5
        </p>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent className="w-fit">
          {() => (
            <>
              <ModalHeader className="flex flex-row gap-x-2">
                <BsStars className="self-center text-2xl text-purple-500" />
                <p className="text-xl">Rate this paper</p>
              </ModalHeader>
              <ModalBody>
                <p>Let us know how you feel about this paper!</p>
                <div className="grid grid-cols-2 grid-rows-3 gap-y-2 w-fit">
                  <h3>Helpful:</h3>
                  <Rating
                    name="helpfull-controlled"
                    value={helpfull}
                    onChange={(_, newValue) => {
                      setHelpfull(newValue || 0);
                    }}
                  />
                  <h3>Standard:</h3>
                  <Rating
                    name="standard-controlled"
                    value={standard}
                    onChange={(_, newValue) => {
                      setStandard(newValue || 0);
                    }}
                  />
                  <h3>Relevance:</h3>
                  <Rating
                    name="relevance-controlled"
                    value={relevance}
                    onChange={(_, newValue) => {
                      setRelevance(newValue || 0);
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
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
