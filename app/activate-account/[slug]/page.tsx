import ActivateAccount from "@/components/ActivateAccountPage/ActivateAccountPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activate Your Account",
};

export default function ActivateAccountPage() {
  return <ActivateAccount />;
}
