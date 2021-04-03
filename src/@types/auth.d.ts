import "next-auth";

declare module "next-auth" {
  interface Session {
    activeSubscription: {
      id: string;
      price_id: string;
      status: string;
    } | null;
  }
}