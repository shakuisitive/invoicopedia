"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CustomerForm } from "./CustomerForm";
import type { Customer } from "./types";
import { useDispatch } from "react-redux";
import { addCustomer } from "@/app/redux/features/customer/customersSlice";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCustomers: any;
  setIsModalOpen: any;
}

export function CustomerModal({
  isOpen,
  onClose,
  setCustomers,
  setIsModalOpen,
}: CustomerModalProps) {
  let dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "testing",
    firstName: "testing",
    lastName: "testing",
    email: "s@gmail.com",
    phone: "",
    accountNumber: "",
    website: "http://localhost:3000/customers",
    notes: "",
    currency: "",
    billingAddress: {
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      postal: "",
    },
    shippingAddress: {
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      postal: "",
    },
    shippingPhone: "",
    deliveryInstructions: "",
  });
  const onAddCustomer = (data) => {
    dispatch(addCustomer(data));
    // setCustomers([...customers, newCustomer]);
    setIsModalOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <CustomerForm
            formData={formData}
            setFormData={setFormData}
            onAddCustomer={onAddCustomer}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
