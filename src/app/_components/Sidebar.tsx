"use client";
import React, { useState } from "react";
import {
  Home,
  CreditCard,
  ShoppingCart,
  Receipt,
  BookOpen,
  Bank,
  Wallet,
  BarChart,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Sales & Payments",
    path: "/sales",
    dropdown: [
      { label: "Estimates", path: "/estimates" },
      { label: "Invoices", path: "/invoices" },
      { label: "Customers", path: "/customers" },
      { label: "Products & Services", path: "/products" },
    ],
  },
  {
    label: "Purchases",
    path: "/purchases",
  },
  {
    label: "Receipts",
    path: "/receipts",
  },
  {
    label: "Accounting",
    path: "/accounting",
  },
  {
    label: "Banking",
    path: "/banking",
  },
  {
    label: "Payroll",
    path: "/payroll",
  },
  {
    label: "Reports",
    path: "/reports",
  },
  {
    label: "Wave Advisors",
    path: "/advisors",
  },
];

function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  return (
    <div className="w-64 bg-[#4dabf7] bg-opacity-10 border-r border-[#4dabf7]/20 p-4 overflow-y-auto">
      <div className="flex items-center mb-8 pl-2">
        <img
          src="https://www.trafongroup.com/wp-content/uploads/2019/04/logo-placeholder.png"
          alt="Logo"
          className="w-10 h-10 mr-3 rounded-full"
        />
        <h2 className="text-xl font-bold text-[#4dabf7]">Invoice App</h2>
      </div>

      <nav>
        {navigationItems.map((item) => (
          <div key={item.label}>
            {item.dropdown ? (
              <div>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#4dabf7]/10 transition-colors",
                    openDropdown === item.label ? "bg-[#4dabf7]/20" : ""
                  )}
                >
                  <div className="flex items-center">{item.label}</div>
                  {openDropdown === item.label ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {openDropdown === item.label && (
                  <div className="pl-6 mt-1">
                    {item.dropdown.map((subItem) => (
                      <Link href={subItem.path}>
                        <div
                          key={subItem.label}
                          className="px-3 py-2 text-sm hover:bg-[#4dabf7]/10 rounded-md cursor-pointer"
                        >
                          {subItem.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-3 py-2 rounded-md hover:bg-[#4dabf7]/10 flex items-center cursor-pointer">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
