import { Suspense } from "react";
import AllCoachesClient from "./AllCoachesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllCoachesClient />
    </Suspense>
  );
} 