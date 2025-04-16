// src/app/dashboard/page.tsx
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <div className="mt-6 p-6 bg-white rounded shadow-sm">
        <p>This is a placeholder for dashboard content.</p>
        <div className="mt-4 space-x-4">
          <Link
            href="/organizations"
            className="text-indigo-600 hover:underline"
          >
            View Organizations
          </Link>
          <Link href="/contacts" className="text-indigo-600 hover:underline">
            View Contacts
          </Link>
        </div>
      </div>
    </div>
  );
}
