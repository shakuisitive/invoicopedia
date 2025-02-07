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

const Dashboard = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Sales & Payments",
      path: "/sales",
      dropdown: [
        { label: "Estimates", path: "/sales/estimates" },
        { label: "Invoices", path: "/sales/invoices" },
        { label: "Customers", path: "/sales/customers" },
        { label: "Products & Services", path: "/sales/products" },
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

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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
                        <div
                          key={subItem.label}
                          className="px-3 py-2 text-sm hover:bg-[#4dabf7]/10 rounded-md cursor-pointer"
                        >
                          {subItem.label}
                        </div>
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

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-[#4dabf7]">Dashboard Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Welcome to your Invoice Management Dashboard. This powerful
                application helps you streamline your financial workflows, track
                sales, manage customer relationships, and generate comprehensive
                financial reports.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-[#4dabf7]/30">
                  <CardHeader>
                    <CardTitle className="text-[#4dabf7]">
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-[#4dabf7]">$45,230</p>
                    <p className="text-sm text-green-600">
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#4dabf7]/30">
                  <CardHeader>
                    <CardTitle className="text-[#4dabf7]">
                      Outstanding Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-[#4dabf7]">17</p>
                    <p className="text-sm text-yellow-600">Pending Payment</p>
                  </CardContent>
                </Card>

                <Card className="border-[#4dabf7]/30">
                  <CardHeader>
                    <CardTitle className="text-[#4dabf7]">Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-[#4dabf7]">124</p>
                    <p className="text-sm text-blue-600">Active Clients</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
