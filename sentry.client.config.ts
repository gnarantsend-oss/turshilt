import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session replay (алдааны үед бичлэг хийх)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,

  integrations: [
    Sentry.replayIntegration({
      maskAllText:   false,   // Текстийг нуух эсэх
      blockAllMedia: false,   // Медиа блоклох эсэх
    }),
  ],

  // Development дотор алдааг консолд харуулна
  debug: process.env.NODE_ENV === "development",

  environment: process.env.NODE_ENV,

  // Хэрэглэгчийн мэдээллийг хассан алдааны гарчиг нэмэх
  beforeSend(event) {
    // Нэвтрэлтийн алдааг тусад нь тэмдэглэх
    if (event.exception?.values?.[0]?.type === "AuthError") {
      event.fingerprint = ["auth-error"];
    }
    return event;
  },
});
