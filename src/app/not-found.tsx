import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {/* TODO: add a back button to the home page
      TODO: add multi-language support */}
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Image src="/not_found.gif" alt="404" width={300} height={300} />
    </div>
  );
}
