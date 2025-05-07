'use client';

import { Button, Text, Modal, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { api } from '@/trpc/react'; 
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

const DeleteAccountSection = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const deleteAccount = api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      await signOut({ redirect: false });
      router.push('/');
    },
    onError: (err) => {
      console.error('Failed to delete account:', err);
    },
  });

  useEffect(() => {
    open();
  }, [open]);

  return (
    <Modal opened={opened} onClose={close} title="Confirm Account Deletion" centered>
      <Text mb="md">
        Are you sure you want to delete your account? This cannot be undone.
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={close}>
          Cancel
        </Button>
        <Button
          color="red"
          loading={deleteAccount.status === 'pending'}
          onClick={() => deleteAccount.mutate()}
        >
          Yes, delete it
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteAccountSection;
