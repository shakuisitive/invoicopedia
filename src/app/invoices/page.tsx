import { Suspense } from "react";
import InvoiceList from "../_components/InvoicePageComponents/InvoiceList";
import InvoiceFilters from "../_components/InvoicePageComponents/InvoiceFilters";
import CreateInvoiceButton from "../_components/InvoicePageComponents/CreateInvoiceButton";

export default function InvoicesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Invoices</h1>
      <div className="flex justify-between items-center mb-6">
        <InvoiceFilters />
        <CreateInvoiceButton />
      </div>
      <Suspense fallback={<div>Loading invoices...</div>}>
        <InvoiceList />
      </Suspense>
    </div>
  );
}
