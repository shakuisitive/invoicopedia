"use client";
import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const INVOICE_DATA = {
  sender: {
    name: "TechNova Solutions",
    email: "billing@technova.com",
    address: "123 Innovation Drive, Silicon Valley, CA 94000",
    phone: "(555) 123-4567",
  },
  recipient: {
    name: "Global Enterprises Inc.",
    email: "accounts@globalenterprises.com",
    address: "456 Corporate Plaza, New York, NY 10001",
  },
  items: [
    {
      description: "Web Development Services",
      quantity: 2,
      unitPrice: 2500,
      total: 5000,
    },
    {
      description: "UI/UX Design Consultation",
      quantity: 1,
      unitPrice: 3000,
      total: 3000,
    },
  ],
  totals: {
    subtotal: 8000,
    tax: 800,
    total: 8800,
  },
};

const CompactColorPicker = ({ color, onChange }) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="flex items-center gap-2 cursor-pointer border rounded p-2">
        <div
          className="w-6 h-6 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm">{color}</span>
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-fit p-0">
      <ChromePicker color={color} onChange={onChange} />
    </PopoverContent>
  </Popover>
);

const TEMPLATES = {
  Template1: ({ logo, color, businessName }) => (
    <div
      className="p-6 bg-white shadow-lg"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="flex justify-between items-center mb-6">
        {logo && <img src={logo} alt="Business Logo" className="h-16 w-auto" />}
        <div className="text-right">
          <h1 className="text-2xl font-bold" style={{ color }}>
            {businessName}
          </h1>
          <p>INVOICE</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold">From:</h3>
          <p>{INVOICE_DATA.sender.name}</p>
          <p>{INVOICE_DATA.sender.email}</p>
          <p>{INVOICE_DATA.sender.address}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold">To:</h3>
          <p>{INVOICE_DATA.recipient.name}</p>
          <p>{INVOICE_DATA.recipient.email}</p>
          <p>{INVOICE_DATA.recipient.address}</p>
        </div>
      </div>
      <table className="w-full mb-6">
        <thead>
          <tr style={{ backgroundColor: color }}>
            <th className="text-white p-2">Description</th>
            <th className="text-white p-2">Quantity</th>
            <th className="text-white p-2">Unit Price</th>
            <th className="text-white p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {INVOICE_DATA.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.description}</td>
              <td className="text-center p-2">{item.quantity}</td>
              <td className="text-center p-2">${item.unitPrice}</td>
              <td className="text-center p-2">${item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right">
        <p>Subtotal: ${INVOICE_DATA.totals.subtotal}</p>
        <p>Tax: ${INVOICE_DATA.totals.tax}</p>
        <p className="font-bold text-xl" style={{ color }}>
          Total: ${INVOICE_DATA.totals.total}
        </p>
      </div>
    </div>
  ),
  // In the TEMPLATES object, update the Modern template:

  Template2: ({ logo, color, businessName }) => (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          {logo && (
            <img src={logo} alt="Business Logo" className="h-16 w-auto mb-2" />
          )}
          <h1 className="text-2xl font-bold" style={{ color }}>
            {businessName}
          </h1>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color }}>
            INVOICE
          </div>
          <div className="text-sm text-gray-600">
            #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold mb-2" style={{ color }}>
            From
          </h3>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{INVOICE_DATA.sender.name}</p>
            <p>{INVOICE_DATA.sender.address}</p>
            <p>{INVOICE_DATA.sender.email}</p>
            <p>{INVOICE_DATA.sender.phone}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold mb-2" style={{ color }}>
            Bill To
          </h3>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{INVOICE_DATA.recipient.name}</p>
            <p>{INVOICE_DATA.recipient.address}</p>
            <p>{INVOICE_DATA.recipient.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {INVOICE_DATA.items.map((item, index) => (
          <div key={index} className="flex justify-between p-4 border-b">
            <div>
              <p className="font-medium">{item.description}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${item.total}</p>
              <p className="text-sm text-gray-600">${item.unitPrice} each</p>
            </div>
          </div>
        ))}

        <div className="p-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${INVOICE_DATA.totals.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${INVOICE_DATA.totals.tax}</span>
            </div>
            <div
              className="flex justify-between font-bold pt-2 border-t"
              style={{ color }}
            >
              <span>Total</span>
              <span>${INVOICE_DATA.totals.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  Template3: ({ logo, color, businessName }) => (
    <div className="p-8 border-2" style={{ borderColor: color }}>
      <div className="text-center mb-8">
        {logo && (
          <img
            src={logo}
            alt="Business Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-serif" style={{ color }}>
          {businessName}
        </h1>
        <p className="text-gray-600 font-serif">INVOICE</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-serif font-bold mb-2 text-lg">From</h3>
          <div className="space-y-1">
            <p>{INVOICE_DATA.sender.name}</p>
            <p>{INVOICE_DATA.sender.address}</p>
            <p>{INVOICE_DATA.sender.email}</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="font-serif font-bold mb-2 text-lg">To</h3>
          <div className="space-y-1">
            <p>{INVOICE_DATA.recipient.name}</p>
            <p>{INVOICE_DATA.recipient.address}</p>
            <p>{INVOICE_DATA.recipient.email}</p>
          </div>
        </div>
      </div>
      <table className="w-full mb-8">
        <thead>
          <tr className="border-y-2" style={{ borderColor: color }}>
            <th className="py-3 font-serif">Description</th>
            <th className="py-3 font-serif">Quantity</th>
            <th className="py-3 font-serif">Unit Price</th>
            <th className="py-3 font-serif">Amount</th>
          </tr>
        </thead>
        <tbody>
          {INVOICE_DATA.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-3">{item.description}</td>
              <td className="py-3 text-center">{item.quantity}</td>
              <td className="py-3 text-center">${item.unitPrice}</td>
              <td className="py-3 text-center">${item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="font-serif">Subtotal</span>
            <span>${INVOICE_DATA.totals.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-serif">Tax</span>
            <span>${INVOICE_DATA.totals.tax}</span>
          </div>
          <div
            className="flex justify-between font-bold text-lg pt-2 border-t-2"
            style={{ borderColor: color }}
          >
            <span className="font-serif">Total</span>
            <span style={{ color }}>${INVOICE_DATA.totals.total}</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

const InvoiceGenerator = () => {
  const [logo, setLogo] = useState(null);
  const [color, setColor] = useState("#2563EB");
  const [template, setTemplate] = useState("Template1");
  const [businessName, setBusinessName] = useState("Your Business Name");

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const Template = TEMPLATES[template];

  return (
    <div className="flex gap-8 p-8 bg-gray-50 min-h-screen">
      <Card className="w-80 h-fit">
        <CardHeader>
          <CardTitle>Invoice Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Upload Logo</Label>
            <Input
              type="file"
              accept=".jpg,.png,.gif"
              onChange={handleLogoUpload}
            />
          </div>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Choose Accent Color</Label>
            <CompactColorPicker
              color={color}
              onChange={(c) => setColor(c.hex)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Template</Label>
            <RadioGroup
              value={template}
              onValueChange={setTemplate}
              className="flex flex-col space-y-2"
            >
              {Object.keys(TEMPLATES).map((temp) => (
                <div key={temp} className="flex items-center space-x-2">
                  <RadioGroupItem value={temp} id={temp} />
                  <Label htmlFor={temp}>{temp}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Template logo={logo} color={color} businessName={businessName} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGenerator;
