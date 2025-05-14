"use client";

import { useEffect, useState, useRef } from 'react';
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
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    if (sdkLoaded && typeof window !== 'undefined' && window.FB?.XFBML) {
      window.FB.XFBML.parse();
    }
  }, [sdkLoaded]);

  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.getApi().updateSize();
    }, 100);
  }, [isMobile]);

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
            Please try a different browser or adjust your browser settings to view the content and refresh your page.
            after adjusting.
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
          padding="md"
          shadow='md'
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Title order={2} mb="md" style={{marginTop: -15}}>Calendar</Title>
          <Box 
            style={{ 
              flex: 1, 
              height: isMobile ? '500px' : '500px',
              width: isMobile ? '100%' : '500px',
              }}
            >
            <FullCalendar
              ref={calendarRef}
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
          <style jsx global>{`
            .fc-day-today {
              background-color:rgb(178, 233, 255) !important;
              border: 1px solidrgb(132, 0, 255) !important;
              color: #000 !important;
            }
          `}</style>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardContent;
