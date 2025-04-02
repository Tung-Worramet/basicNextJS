"use client";

import Hello from "./Hello";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <div>
      <Hello name="Kob" age={20} />
      <Hello name="Tung" age={25} />
      <Hello name="Tong" />

      <Link href="/hello">Go to HelloPage</Link>
      <br />
      <button onClick={() => router.push("/hello")}>
        Go to HelloPage (with useRouter)
      </button>
    </div>
  );
};

export default page;
