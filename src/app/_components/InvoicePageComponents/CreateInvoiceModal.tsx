"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import InvoiceItem from "./InvoiceItem";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
}: CreateInvoiceModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customer, setCustomer] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [poSo, setPoSo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Date>();
  const [paymentDue, setPaymentDue] = useState<Date>();
  const [items, setItems] = useState([
    { title: "", description: "", quantity: 1, price: 0 },
  ]);

  const recentCustomers = [
    { label: "Acme Corp", value: "acme" },
    { label: "Globex", value: "globex" },
    { label: "Initech", value: "initech" },
  ];

  const handleAddItem = () => {
    setItems([...items, { title: "", description: "", quantity: 1, price: 0 }]);
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      title,
      description,
      customer,
      invoiceNumber,
      poSo,
      invoiceDate,
      paymentDue,
      items,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Invoice Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="logo">Logo (300x200 max)</Label>
            <Input id="logo" type="file" accept="image/*" />
          </div>
          <Combobox
            items={recentCustomers}
            placeholder="Select customer"
            onSelect={(value) => setCustomer(value)}
            value={customer}
          >
            <div className="p-2">
              <a
                href="http://localhost:3000/customers"
                className="text-sm text-blue-500 hover:underline"
              >
                Want to see more customers? Click here
              </a>
            </div>
          </Combobox>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="poSo">PO/SO</Label>
              <Input
                id="poSo"
                value={poSo}
                onChange={(e) => setPoSo(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoiceDate ? (
                      format(invoiceDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    onSelect={setInvoiceDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Payment Due</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {paymentDue ? (
                      format(paymentDue, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={paymentDue}
                    onSelect={setPaymentDue}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label>Invoice Items</Label>
            {items.map((item, index) => (
              <InvoiceItem
                key={index}
                item={item}
                onChange={(field, value) =>
                  handleItemChange(index, field, value)
                }
              />
            ))}
            <Button type="button" onClick={handleAddItem} className="mt-2">
              Add Item
            </Button>
          </div>
          <Button type="submit">Create Invoice</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
