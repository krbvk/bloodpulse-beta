"use client";

import { useEffect, useState } from 'react';
import { Box, Title, Alert, Card } from '@mantine/core'; 
import type { Session } from 'next-auth';
import { useSdkContext } from '@/components/Dashboard/SdkContext';
import { useMediaQuery } from '@mantine/hooks';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

type Props = {
  session: Session | null;
};

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

const DashboardContent = ({ session }: Props) => {
  const { sdkLoaded, sdkFailed } = useSdkContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (sdkLoaded && typeof window !== 'undefined' && window.FB?.XFBML) {
      window.FB.XFBML.parse();
    }
  }, [sdkLoaded]);

  if (!session || !session.user) return null;

  return (
    <Box
      px="md"
      py="lg"
      style={{
        overflowY: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px',
      }}
    >
      <Box style={{ flex: 1 }}>
        <Title order={2} mb="md">
          Announcements
        </Title>

        {!sdkLoaded && sdkFailed && (
          <Alert title="Content Not Available" color="red">
            It seems like you're using a browser that blocks Facebook content (e.g., Brave Browser). 
            Please try a different browser or adjust your browser settings to view the content.
          </Alert>
        )}

        {sdkLoaded && !sdkFailed && (
          <div
            className="fb-page"
            data-href="https://www.facebook.com/olfurcyval"
            data-tabs="timeline"
            data-width="800"
            data-height="600"
            data-small-header="false"
            data-adapt-container-width="false"
            data-hide-cover="false"
            data-show-facepile="true"
          ></div>
        )}
      </Box>

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card
          padding="lg"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Title order={2} mb="md">Calendar</Title>
          <Box style={{ flex: 1, maxWidth: '500px', width: '100%' }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="100%"
              headerToolbar={{
                start: 'title',
                center: '',
                end: 'prev,next',
              }}
            />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardContent;
