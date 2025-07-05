import { useState } from "react";
import { InsertStore } from "@shared/schema";
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
import { cn } from "@/lib/utils";

interface BrandingFormProps {
  initialValues: Partial<InsertStore>;
  onChange: (values: Partial<InsertStore>) => void;
}

export function BrandingForm({ initialValues, onChange }: BrandingFormProps) {
  const [formValues, setFormValues] = useState<Partial<InsertStore>>(
    initialValues || {}
  );

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Open Sans", label: "Open Sans" },
  ];

  const updateField = (field: keyof InsertStore, value: any) => {
    const updatedValues = { ...formValues, [field]: value };
    setFormValues(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Store Information</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Store Name*</Label>
          <Input
            id="name"
            value={formValues.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your Store Name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Store Description</Label>
          <Textarea
            id="description"
            value={formValues.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your store in a few sentences"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Brand Appearance</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={formValues.primaryColor || "#3563E9"}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-10 h-10 p-1 rounded-md cursor-pointer"
              />
              <Input
                value={formValues.primaryColor || "#3563E9"}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                placeholder="#3563E9"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accentColor"
                type="color"
                value={formValues.accentColor || "#F97316"}
                onChange={(e) => updateField("accentColor", e.target.value)}
                className="w-10 h-10 p-1 rounded-md cursor-pointer"
              />
              <Input
                value={formValues.accentColor || "#F97316"}
                onChange={(e) => updateField("accentColor", e.target.value)}
                placeholder="#F97316"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={formValues.fontFamily || "Inter"}
            onValueChange={(value) => updateField("fontFamily", value)}
          >
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Select a font family" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                  className={cn("font-[" + font.value + "]")}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL (optional)</Label>
          <Input
            id="logoUrl"
            value={formValues.logoUrl || ""}
            onChange={(e) => updateField("logoUrl", e.target.value)}
            placeholder="https://example.com/your-logo.png"
          />
          <p className="text-xs text-muted-foreground">
            Enter a URL to your logo image. For best results, use a square or
            rectangular image with transparent background.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Store Preview</h3>
        <div
          className="border rounded-lg p-6 overflow-hidden"
          style={{
            fontFamily: formValues.fontFamily || "Inter",
          }}
        >
          <div
            className="w-full h-12 mb-4 rounded flex items-center px-4"
            style={{
              backgroundColor: formValues.primaryColor || "#3563E9",
              color: "#FFFFFF",
            }}
          >
            <span className="font-bold text-xl">
              {formValues.name || "Your Store Name"}
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {formValues.description || "Your store description will appear here."}
            </p>
          </div>
          <div
            className="px-4 py-2 rounded inline-block"
            style={{
              backgroundColor: formValues.accentColor || "#F97316",
              color: "#FFFFFF",
            }}
          >
            <span className="font-medium">Shop Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
