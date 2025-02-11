import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This would typically come from an API call
const invoices = [
  {
    id: "INV001",
    customer: "Acme Corp",
    status: "Paid",
    amount: 1000,
    date: "2023-05-01",
  },
  {
    id: "INV002",
    customer: "Globex",
    status: "Due",
    amount: 2000,
    date: "2023-05-15",
  },
  {
    id: "INV003",
    customer: "Initech",
    status: "Overpaid",
    amount: 1500,
    date: "2023-05-20",
  },
];

export default function InvoiceList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
            <TableCell>{invoice.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
