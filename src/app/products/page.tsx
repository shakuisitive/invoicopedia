"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";

const ProductManagement = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Consulting Service",
      description: "Business consulting",
      price: 150,
      canSell: true,
      canBuy: false,
      itemType: "consulting",
      salesTax: ["VAT"],
    },
    {
      id: 2,
      name: "Office Supplies",
      description: "General supplies",
      price: 50,
      canBuy: true,
      canSell: false,
      expenseType: "office_supplies",
    },
  ]);

  const [taxes, setTaxes] = useState([
    {
      id: 1,
      name: "Value Added Tax",
      abbreviation: "VAT",
      rate: 20,
      description: "Standard VAT",
      taxNumber: "GB123456789",
    },
    {
      id: 2,
      name: "Sales Tax",
      abbreviation: "ST",
      rate: 10,
      description: "State Sales Tax",
      taxNumber: "ST987654321",
    },
  ]);

  const expenseTypes = [
    "accounting_fee",
    "office_supplies",
    "utilities",
    "rent",
    "insurance",
    "marketing",
    "travel",
    "training",
    "software_subscriptions",
    "maintenance",
    "legal_fees",
    "bank_charges",
    "telecommunications",
    "office_equipment",
    "professional_services",
  ];

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    canSell: false,
    canBuy: false,
    itemType: "",
    expenseType: "",
    salesTax: [],
  });

  const [taxFormData, setTaxFormData] = useState({
    name: "",
    abbreviation: "",
    rate: "",
    description: "",
    taxNumber: "",
  });

  const handleProductSubmit = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...formData, id: p.id } : p
        )
      );
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      canSell: false,
      canBuy: false,
      itemType: "",
      expenseType: "",
      salesTax: [],
    });
  };

  const handleTaxSubmit = () => {
    setTaxes([...taxes, { ...taxFormData, id: Date.now() }]);
    setIsTaxModalOpen(false);
    setTaxFormData({
      name: "",
      abbreviation: "",
      rate: "",
      description: "",
      taxNumber: "",
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsProductModalOpen(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const resetFormFields = () =>
    setFormData({
      name: "",
      description: "",
      price: "",
      canSell: false,
      canBuy: false,
      itemType: "",
      expenseType: "",
      salesTax: [],
    });

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4dabf7]">
          Products & Services
        </h1>
        <Button
          onClick={() => setIsProductModalOpen(true)}
          className="bg-[#4dabf7] hover:bg-[#339af0]"
        >
          <Plus className="mr-2 h-4 w-4" />{" "}
          <span onClick={resetFormFields}>Add Product/Service</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-[#4dabf7]">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="mt-2 font-medium">${product.price}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="border-[#4dabf7] text-[#4dabf7] hover:bg-[#4dabf7] hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(product.id)}
                  className="border-[#4dabf7] text-[#4dabf7] hover:bg-[#4dabf7] hover:text-white"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm">
              {product.canSell && (
                <span className="text-[#4dabf7] mr-2">Sellable</span>
              )}
              {product.canBuy && (
                <span className="text-[#4dabf7]">Purchasable</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product/Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canSell"
                  checked={formData.canSell}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, canSell: checked })
                  }
                />
                <Label htmlFor="canSell">Can Sell</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canBuy"
                  checked={formData.canBuy}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, canBuy: checked })
                  }
                />
                <Label htmlFor="canBuy">Can Buy</Label>
              </div>
            </div>

            {formData.canSell && (
              <div>
                <Label htmlFor="itemType">Item Type</Label>
                <Select
                  value={formData.itemType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, itemType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.canBuy && (
              <div>
                <Label htmlFor="expenseType">Expense Type</Label>
                <Select
                  value={formData.expenseType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, expenseType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Sales Tax</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTaxModalOpen(true)}
                  className="text-[#4dabf7] border-[#4dabf7]"
                >
                  Add New Tax
                </Button>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.id} value={tax.abbreviation}>
                      {tax.name} ({tax.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleProductSubmit}
              className="w-full bg-[#4dabf7] hover:bg-[#339af0]"
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTaxModalOpen} onOpenChange={setIsTaxModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tax</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taxName">Tax Name</Label>
              <Input
                id="taxName"
                value={taxFormData.name}
                onChange={(e) =>
                  setTaxFormData({ ...taxFormData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="abbreviation">Abbreviation</Label>
              <Input
                id="abbreviation"
                value={taxFormData.abbreviation}
                onChange={(e) =>
                  setTaxFormData({
                    ...taxFormData,
                    abbreviation: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="rate">Tax Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                value={taxFormData.rate}
                onChange={(e) =>
                  setTaxFormData({ ...taxFormData, rate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="taxDescription">Description</Label>
              <Input
                id="taxDescription"
                value={taxFormData.description}
                onChange={(e) =>
                  setTaxFormData({
                    ...taxFormData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="taxNumber">Tax Number</Label>
              <Input
                id="taxNumber"
                value={taxFormData.taxNumber}
                onChange={(e) =>
                  setTaxFormData({ ...taxFormData, taxNumber: e.target.value })
                }
              />
            </div>
            <Button
              onClick={handleTaxSubmit}
              className="w-full bg-[#4dabf7] hover:bg-[#339af0]"
            >
              Add Tax
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
