"use client";

import ServiceCard from "@/components/ServiceCard";

export default function Home() {
  const services = [
    { title: "Raise Complaint", link: "/raise-complaint", img: "/assets/raise-complaint.png" },
    { title: "Track Complaint Status", link: "/track-status", img: "/assets/track-complaint.png" },
    { title: "Loan Interest Certificate for PIT", link: "/loan-certificate", img: "/assets/certificate-pit.png" },
    { title: "Activate Dormant Account", link: "/dormant-account", img: "/assets/activate-dormant-account.png" },
    { title: "ePay Deregistration Request", link: "/epay-deregister", img: "/assets/epay-deregistration.png" },
    { title: "Online Account Opening", link: "https://kyc.bdb.bt/", img: "/assets/online-acc-open-portal.png" },
    { title: "Update KYC", link: "https://kyc.bdb.bt/", img: "/assets/kyc-update-portal.png" },
    { title: "Calculators", link: "/calculators", img: "/assets/calculator.png" },
  ];

  return (
    <div className="container mx-auto px-4">
      <main className="main py-10">
        <div className="service-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map(({ title, link, img }, i) => (
            <ServiceCard
              key={i}
              icon={
                <div className="w-fit mx-auto mb-3">
                  <img
                    src={img}
                    alt={title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              }
              title={title}
              link={link}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
