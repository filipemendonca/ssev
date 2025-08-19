export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
        <h1 className="text-2xl text-center font-bold">SSEV</h1>
        <div className="mb-4 flex items-center justify-center">
          <h1 className="text-xl text-center font-medium">
            Sistema para solicitações de exames veterinários
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
