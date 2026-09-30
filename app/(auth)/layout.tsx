export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
      <p className="font-mono text-sm text-primary mb-4 text-center">
        {"> auth.session()"}
      </p>
      <div className="card w-full max-w-md p-8 bg-base-200 border border-base-300 rounded-box shadow">
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}