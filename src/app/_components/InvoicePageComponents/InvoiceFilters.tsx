"use client";

import { useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const statuses = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Overpaid", value: "overpaid" },
  { label: "Due", value: "due" },
  { label: "Sent", value: "sent" },
  { label: "Unsent", value: "unsent" },
];

export default function InvoiceFilters() {
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [invoiceId, setInvoiceId] = useState("");

  // This would typically come from an API call
  const recentCustomers = [
    { label: "Acme Corp", value: "acme" },
    { label: "Globex", value: "globex" },
    { label: "Initech", value: "initech" },
  ];

  return (
    <div className="flex space-x-4 items-end">
      <Combobox
        items={recentCustomers}
        placeholder="Filter by customer"
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
      <Combobox
        items={statuses}
        placeholder="Filter by status"
        onSelect={(value) => setStatus(value)}
        value={status}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFrom ? format(dateFrom, "PPP") : <span>From date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={setDateFrom}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateTo ? format(dateTo, "PPP") : <span>To date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={setDateTo}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Input
        placeholder="Invoice ID"
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        className="w-[200px]"
      />
    </div>
  );
}
