/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Section,
  Text,
} from '@react-email/components';

import { LOGO_URL } from '../constants/constants/shared';
import { RESET_LINK_TTL_HRS } from '../constants/constants/auth';

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
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

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
  margin: '0 auto',
};

export function ResetPasswordEmail({
  userFirstname,
  resetPasswordLink,
}: ResetPasswordEmailProps) {
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
              Someone recently requested a password change for your Exam Archive
              account. If this was you, you can set a new password here:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text
              style={{
                ...text,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              Please note that the link is valid for {RESET_LINK_TTL_HRS} hours
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Hr />
            <Text
              style={{
                ...text,
                fontStyle: 'italic',
                textAlign: 'justify',
              }}
            >
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>Cheers,</Text>
            <Text style={{ ...text, lineHeight: '3px', textAlign: 'justify' }}>
              Team Exam Archive
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ResetPasswordEmail;
