"use client";

import { useState } from "react";

import { CustomerList } from "../_components/CustomersPageComponents/CustomerList";
import { CustomerModal } from "../_components/CustomersPageComponents/CustomerModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { Customer } from "./types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addCustomer = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Customers</h1>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-[#4dabf7] hover:bg-[#3a8ac7]"
      >
        <PlusIcon className="mr-2 h-4 w-4" /> Add Customer
      </Button>
      <CustomerList customers={customers} />
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCustomer={addCustomer}
      />
    </div>
  );
}
