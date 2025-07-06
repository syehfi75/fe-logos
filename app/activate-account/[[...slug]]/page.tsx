import ActivateAccount from "@/components/ActivateAccountPage/ActivateAccountPage";
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
  return <ActivateAccount slug={slug} />;
}
