import { Button } from '@nextui-org/react';
import { FaRegStar } from 'react-icons/fa';

export default function RatingSection() {
  return (
    <>
      <div>
        <p>Ratings ( 1.2K+ users voted )</p>
        <Button>Rate Here</Button>
      </div>
      <div>
        <p>Helpful</p>
        <ul>
          <li>
            <FaRegStar />
          </li>
          <li>
            <FaRegStar />
          </li>
          <li>
            <FaRegStar />
          </li>
          <li>
            <FaRegStar />
          </li>
          <li>
            <FaRegStar />
          </li>
        </ul>
        <p>4.7 / 5</p>
      </div>
    </>
  );
}
