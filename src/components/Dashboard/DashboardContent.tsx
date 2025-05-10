import { Box, Title, Alert } from '@mantine/core';
import type { Session } from 'next-auth';
import { useSdkContext } from '@/components/Dashboard/SdkContext'

type Props = {
  session: Session | null;
};

const DashboardContent = ({ session }: Props) => {
  const { sdkLoaded, sdkFailed } = useSdkContext();

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
  );
};

export default DashboardContent;
