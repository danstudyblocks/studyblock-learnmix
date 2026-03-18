import Header from "@/components/global/Header";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      {children}
      <ScrollToTopButton />
    </main>
  );
}

export default layout;
