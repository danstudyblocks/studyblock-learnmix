import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}

      {/* ScrollToTopButton - Hidden */}
      {/* <ScrollToTopButton /> */}
    </main>
  );
}

export default layout;
