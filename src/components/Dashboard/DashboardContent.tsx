import { Box, Title, Text, Alert } from '@mantine/core';
import type { Session } from 'next-auth';
import { useState, useEffect } from 'react';

type Props = {
  session: Session | null;
};

const DashboardContent = ({ session }: Props) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkFailed, setSdkFailed] = useState(false);

  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) return;

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;

    script.onload = () => setSdkLoaded(true);
    script.onerror = () => setSdkFailed(true);

    document.body.appendChild(script);
  }, []);

  if (!session) return null;

  return (
    <Box
      px="md"
      py="lg"
      style={{
        overflowY: 'hidden',
        maxHeight: '100%',
        width: 800,
        maxWidth: '100%',
      }}
    >
      <Title order={2} mb="md">
        Announcements
      </Title>

      {!sdkLoaded && sdkFailed && (
        <Alert title="Content Not Available" color="red">
          It seems like you&apos;re using a browser that blocks Facebook content (e.g., Brave Browser). 
          Please try a different browser or adjust your browser settings to view the content.
        </Alert>
      )}

      {sdkLoaded && !sdkFailed && (
        <div
          className="fb-page"
          data-href="https://www.facebook.com/earthshakerph"
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
  );
};

export default DashboardContent;
