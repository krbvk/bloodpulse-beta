"use client";

import { useState, useEffect } from "react";
import { Button, Text, Input, Heading } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { subscribeUser, unsubscribeUser, sendNotification } from "@/app/action";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      void registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.error("VAPID public key is missing");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    setSubscription(sub);
    try {
      await subscribeUser(sub);
    } catch (error) {
      console.error("Subscription error:", error);
    }
  }

  async function unsubscribeFromPush() {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        setSubscription(null);
        await unsubscribeUser();
      } catch (error) {
        console.error("Unsubscription error:", error);
      }
    }
  }

  async function sendTestNotification() {
    if (subscription) {
      try {
        await sendNotification(message);
        setMessage("");
      } catch (error) {
        console.error("Notification error:", error);
      }
    }
  }

  if (!isSupported) {
    return <Text color="red">Push notifications are not supported in this browser.</Text>;
  }

  return (
    <Box shadow="sm" p="lg" borderRadius="md" borderWidth="1px">
      <Heading as="h3" size="md">Push Notifications</Heading>
      {subscription ? (
        <>
          <Text>You are subscribed to push notifications.</Text>
          <Button color="red" mt="md" onClick={unsubscribeFromPush}>
            Unsubscribe
          </Button>
          <Input
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            mt="md"
          />
          <Button mt="md" onClick={sendTestNotification}>
            Send Test
          </Button>
        </>
      ) : (
        <>
          <Text>You are not subscribed to push notifications.</Text>
          <Button color="blue" mt="md" onClick={subscribeToPush}>
            Subscribe
          </Button>
        </>
      )}
    </Box>
  );
}
