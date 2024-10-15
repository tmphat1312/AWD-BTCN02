export default function PhotosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="p-4 md:my-8 md:p-8 container mx-auto space-y-4">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold uppercase italic">
          Photo Gallery
        </h1>
        <p>AWP - CQ2021/3 - IA02</p>
        <p>
          by 21120524 - <span lang="vi">Trương Minh Phát</span>
        </p>
      </header>
      {children}
    </main>
  );
}
