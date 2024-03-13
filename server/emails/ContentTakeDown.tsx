/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';

import { LOGO_URL } from '../constants/constants/shared';

interface ContentTakeDownProps {
  userFirstname?: string;
  fileLink?: string;
  comment?: { postLink: string; message: string };
}

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

export function ContentTakeDownEmail({
  userFirstname,
  fileLink,
  comment,
}: ContentTakeDownProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img src={LOGO_URL} width="100%" height="100" alt="Exam Archive" />
          <Section>
            <Text style={{ ...text, textAlign: 'justify' }}>
              {`Hi ${userFirstname},`}
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              We are writing to inform you that we have received reports
              regarding inappropriate content associated with your account on
              Exam Archive. As a responsible member of our community, it is
              imperative to adhere to our guidelines and standards.
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              Upon review, it has come to our attention that the following
              content violates our terms of service:
            </Text>
            {fileLink ? (
              <Link
                href={fileLink}
                style={{ ...text, color: 'blue', textAlign: 'justify' }}
              >
                View your post here
              </Link>
            ) : comment ? (
              <>
                <Text
                  style={{
                    ...text,
                    fontStyle: 'italic',
                    backgroundColor: '#F5F5DC',
                    padding: '10px',
                    borderRadius: '3px',
                    textAlign: 'justify',
                  }}
                >
                  {comment.message}
                </Text>
                <Text style={{ ...text, textAlign: 'justify' }}>
                  in post{' '}
                  <Link
                    href={comment.postLink}
                    style={{ ...text, color: 'blue', textAlign: 'justify' }}
                  >
                    {comment.postLink}
                  </Link>
                </Text>
              </>
            ) : null}
            <Text
              style={{
                ...text,
                fontWeight: 'bold',
                fontStyle: 'italic',
                textAlign: 'justify',
              }}
            >
              We want to emphasize that such content is not acceptable on our
              platform and contravenes our community guidelines. In light of
              this, we have removed the content from our platform.
            </Text>
            <Text
              style={{ ...text, fontStyle: 'italic', textAlign: 'justify' }}
            >
              We understand that mistakes can happen, and we encourage you to
              familiarize yourself with our guidelines to prevent similar
              occurrences in the future.
            </Text>

            <Text style={{ ...text, textAlign: 'justify' }}>
              If you believe this notice has been sent in error or if you have
              any questions regarding this matter, please do not hesitate to
              contact our support team.
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>Thank You,</Text>
            <Text style={{ ...text, lineHeight: '3px', textAlign: 'justify' }}>
              Team Exam Archive
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ContentTakeDownEmail;
