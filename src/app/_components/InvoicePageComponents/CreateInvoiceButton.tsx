"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateInvoiceModal from "./CreateInvoiceModal";

export default function CreateInvoiceButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Create Invoice</Button>
      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
