import { Suspense } from "react";
import VerifyMfa from "./_verifymfa";

const PageMFA = () => {
  return (
    <Suspense>
      <VerifyMfa />
    </Suspense>
  );
};

export default PageMFA;
