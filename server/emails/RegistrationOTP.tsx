/* eslint-disable no-magic-numbers */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Section,
  Text,
} from '@react-email/components';

import { REGISTRATION_OTP_TTL_SECONDS } from '../constants/constants/auth';

interface RegistrationOTPEmailProps {
  userFirstname?: string;
  verificationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

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
  textAlign: 'justify',
};

export function RegistrationOTPEmail({
  userFirstname,
  verificationCode,
}: RegistrationOTPEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="Exam Archive"
          />
          <Section>
            <Text style={text}>{`Hi ${userFirstname},`}</Text>
            <Text style={text}>
              Thanks for starting the new Exam Archive account creation process.
              We want to make sure it&apos;s really you.
            </Text>
            <Text style={text}>
              Please enter the following verification code when prompted. If you
              don&apos;t want to create an account, you can ignore this message.
            </Text>
            <Text
              style={{
                ...text,
                fontWeight: 'bold',
                letterSpacing: '4px',
                fontSize: '30px',
                textAlign: 'center',
              }}
            >
              {verificationCode}
            </Text>
            <Text style={{ ...text, textAlign: 'center', fontStyle: 'italic' }}>
              Please note that this OTP is valid for{' '}
              {REGISTRATION_OTP_TTL_SECONDS / 60} minutes
            </Text>
            <Hr />
            <Text style={{ ...text, fontStyle: 'italic' }}>
              Exam Archive will never email you and ask you to disclose or
              verify your password.
            </Text>
            <Text style={text}>Cheers,</Text>
            <Text style={{ ...text, lineHeight: '3px' }}>
              Team Exam Archive
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default RegistrationOTPEmail;
