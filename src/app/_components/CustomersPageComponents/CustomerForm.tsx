"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import type { Customer } from "./types";
// import { useToast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";

interface CustomerFormProps {
  onAddCustomer: (customer: Customer) => void;
}

export function CustomerForm({ onAddCustomer }: CustomerFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accountNumber: "",
    website: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (
    addressType: "billing" | "shipping",
    field: string,
    value: string
  ) => {
    setFormData({
      ...formData,
      [`${addressType}Address`]: {
        ...formData[`${addressType}Address`],
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      accountNumber: formData.accountNumber,
    };
    onAddCustomer(newCustomer);
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been successfully added.`,
    });
    // Reset form
    setFormData({
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      accountNumber: "",
      website: "",
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TabsContent value="basic" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Customer</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Primary contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="billing" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Billing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Billing address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingAddress1">Address</Label>
                <Input
                  id="billingAddress1"
                  name="billingAddress1"
                  value={formData.billingAddress.address1}
                  onChange={(e) =>
                    handleAddressChange("billing", "address1", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="billingAddress2">Address 2 (optional)</Label>
                <Input
                  id="billingAddress2"
                  name="billingAddress2"
                  value={formData.billingAddress.address2}
                  onChange={(e) =>
                    handleAddressChange("billing", "address2", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="billingCountry">Country</Label>
                <Input
                  id="billingCountry"
                  name="billingCountry"
                  value={formData.billingAddress.country}
                  onChange={(e) =>
                    handleAddressChange("billing", "country", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="billingState">Province, State…</Label>
                <Input
                  id="billingState"
                  name="billingState"
                  value={formData.billingAddress.state}
                  onChange={(e) =>
                    handleAddressChange("billing", "state", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  name="billingCity"
                  value={formData.billingAddress.city}
                  onChange={(e) =>
                    handleAddressChange("billing", "city", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="billingPostal">Postal</Label>
                <Input
                  id="billingPostal"
                  name="billingPostal"
                  value={formData.billingAddress.postal}
                  onChange={(e) =>
                    handleAddressChange("billing", "postal", e.target.value)
                  }
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() =>
                setFormData({
                  ...formData,
                  billingAddress: {
                    address1: "",
                    address2: "",
                    country: "",
                    state: "",
                    city: "",
                    postal: "",
                  },
                })
              }
            >
              Clear address
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Shipping</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipTo">Ship to</Label>
              <Input id="shipTo" name="shipTo" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Shipping address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingAddress1">Address</Label>
                <Input
                  id="shippingAddress1"
                  name="shippingAddress1"
                  value={formData.shippingAddress.address1}
                  onChange={(e) =>
                    handleAddressChange("shipping", "address1", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="shippingAddress2">Address 2 (optional)</Label>
                <Input
                  id="shippingAddress2"
                  name="shippingAddress2"
                  value={formData.shippingAddress.address2}
                  onChange={(e) =>
                    handleAddressChange("shipping", "address2", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="shippingCountry">Country</Label>
                <Input
                  id="shippingCountry"
                  name="shippingCountry"
                  value={formData.shippingAddress.country}
                  onChange={(e) =>
                    handleAddressChange("shipping", "country", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="shippingState">Province, State…</Label>
                <Input
                  id="shippingState"
                  name="shippingState"
                  value={formData.shippingAddress.state}
                  onChange={(e) =>
                    handleAddressChange("shipping", "state", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="shippingCity">City</Label>
                <Input
                  id="shippingCity"
                  name="shippingCity"
                  value={formData.shippingAddress.city}
                  onChange={(e) =>
                    handleAddressChange("shipping", "city", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="shippingPostal">Postal</Label>
                <Input
                  id="shippingPostal"
                  name="shippingPostal"
                  value={formData.shippingAddress.postal}
                  onChange={(e) =>
                    handleAddressChange("shipping", "postal", e.target.value)
                  }
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() =>
                setFormData({
                  ...formData,
                  shippingAddress: {
                    address1: "",
                    address2: "",
                    country: "",
                    state: "",
                    city: "",
                    postal: "",
                  },
                })
              }
            >
              Clear address
            </Button>
          </div>
          <div className="mt-4">
            <Label htmlFor="shippingPhone">Phone</Label>
            <Input
              id="shippingPhone"
              name="shippingPhone"
              type="tel"
              value={formData.shippingPhone}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
            <Textarea
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={formData.deliveryInstructions}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </TabsContent>

      <Button type="submit" className="w-full bg-[#4dabf7] hover:bg-[#3a8ac7]">
        Add Customer
      </Button>
    </form>
  );
}
