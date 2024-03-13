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

interface NotifyUserOnBeingAdminProps {
  username: string;
  email: string;
  password: string;
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

export function NotifyUserOnBeingAdminEmail({
  username,
  email,
  password,
}: NotifyUserOnBeingAdminProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img src={LOGO_URL} width="100%" height="100" alt="Exam Archive" />
          <Section>
            <Text style={{ ...text, textAlign: 'justify' }}>
              {`Hi ${username},`}
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              I hope this email finds you well. As requested, I am providing you
              with the admin login details for Exam Archive. With these
              credentials, you will have access to the administrative functions
              and privileges within the system.
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              Click <Link href="https://example.com">here</Link> to login. Below
              are your login credentials:
            </Text>
            <Text
              style={{
                ...text,
                fontWeight: 'bold',
                fontStyle: 'italic',
                textAlign: 'left',
              }}
            >
              Username : {username}
            </Text>
            <Text
              style={{
                ...text,
                fontWeight: 'bold',
                fontStyle: 'italic',
                textAlign: 'left',
              }}
            >
              Email : {email}
            </Text>
            <Text
              style={{
                ...text,
                fontWeight: 'bold',
                fontStyle: 'italic',
                textAlign: 'left',
              }}
            >
              Password : {password}
            </Text>
            <Text
              style={{ ...text, fontStyle: 'italic', textAlign: 'justify' }}
            >
              {`Please ensure to keep these details confidential and secure. It's
              advisable to change your password upon your first login for added
              security.`}
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              Should you encounter any issues or have any questions regarding
              the administrative functions or your account, please feel free to
              reach out to our support team
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              Welcome aboard!
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

export default NotifyUserOnBeingAdminEmail;
