import SubscribePage from "@/components/Subscribe/SubscribePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activate Your Account",
};

export default async function ActivateAccountPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params
  return <SubscribePage slug={slug} />;
}
