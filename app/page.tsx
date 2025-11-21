import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={128}
          height={128}
          className="mx-auto mb-4"
        />
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome to Our Next.js App!
        </h1>
        <p className="text-zinc-700 dark:text-zinc-300">
          This is the home page of your Next.js application.
        </p>
      </div>
    </div>
  );
}
