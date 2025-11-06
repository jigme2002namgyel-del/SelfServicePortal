"use client";
import Link from "next/link";

export default function ServiceCard({ icon, title, link }) {
  return (
    <Link
      href={link}
      className="block no-underline hover:no-underline"
      style={{ textDecoration: "none" }}
    >
      <div className="service-card flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow">
        {icon}
        <h3 className="mt-4 text-lg font-semibold text-gray-800">{title}</h3>
      </div>
    </Link>
  );
}
