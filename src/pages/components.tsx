import "../app/globals.css";

export async function getServerSideProps() {
  if (process.env.NODE_ENV !== "development") {
    return { notFound: true };
  }
  return { props: {} };
}

// components demo page
export default function ComponentsDemoPage() {
  return (
    <div className="flex flex-col items-center">
      Here goes the components demo page.
    </div>
  );
}
