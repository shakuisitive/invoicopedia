import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvoiceItemProps {
  item: {
    title: string;
    description: string;
    quantity: number;
    price: number;
  };
  onChange: (field: string, value: string | number) => void;
}

export default function InvoiceItem({ item, onChange }: InvoiceItemProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label>Title</Label>
        <Input
          value={item.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          value={item.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div>
        <Label>Quantity</Label>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) =>
            onChange("quantity", Number.parseInt(e.target.value))
          }
          required
        />
      </div>
      <div>
        <Label>Price</Label>
        <Input
          type="number"
          value={item.price}
          onChange={(e) => onChange("price", Number.parseFloat(e.target.value))}
          required
        />
      </div>
    </div>
  );
}
