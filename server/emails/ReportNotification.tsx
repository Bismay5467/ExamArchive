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

import { reasonsForReport } from '../constants/constants/report';

import { LOGO_URL } from '../constants/constants/shared';

interface ReportNotificationEmailProps {
  totalNoOfReports: number;
  reasons: typeof reasonsForReport;
  content: {
    type: string;
    link?: string;
    comment?: string;
  };
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

export function ReportNotificationEmail({
  totalNoOfReports = 100,
  reasons = [],
  content = { type: 'COMMENT', comment: 'This is a comment' },
}: ReportNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img src={LOGO_URL} width="100%" height="100" alt="Exam Archive" />
          <Section>
            <Text style={{ ...text, textAlign: 'justify' }}>
              Hi Superadmin,
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              This is an automated notification to bring to your attention a
              post on our platform that has been mass reported by users. The
              content of this post has raised significant concerns among our
              community members, prompting multiple reports.
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              {`Given the nature of the reports and the potential impact on our
              platform's reputation and user experience, I kindly request your
              immediate attention to review the content of this ${content.type.toLowerCase()}.`}
            </Text>
            {content.type === 'POST' && (
              <Link
                href={content.link}
                style={{ ...text, color: 'blue', textAlign: 'justify' }}
              >
                View the post here
              </Link>
            )}
            {content.type === 'COMMENT' && (
              <Text
                style={{
                  ...text,
                  textAlign: 'justify',
                  backgroundColor: '#f7fa98',
                  padding: '10px',
                }}
              >
                {content.comment}
              </Text>
            )}

            <Text
              style={{ ...text, fontStyle: 'italic', textAlign: 'justify' }}
            >
              Report count : {totalNoOfReports}
            </Text>
            <Text
              style={{ ...text, fontStyle: 'italic', textAlign: 'justify' }}
            >
              Reported Reasons : {(reasons ?? []).join(', ')}
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              {`As an super admin, your prompt intervention and assessment of this
              matter are crucial to maintaining the integrity and safety of our
              platform. We take reports from our users seriously, and it's
              imperative that we address any content that violates our community
              guidelines or poses a risk to our users.`}
            </Text>
            <Text style={{ ...text, textAlign: 'justify' }}>
              Thank you for your attention in this matter
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

export default ReportNotificationEmail;
