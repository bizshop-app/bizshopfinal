import { Template } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplate,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose a Store Template</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select a template for your store. You can customize colors, fonts, and other elements in the next step.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 relative group",
              selectedTemplate === template.id
                ? "border-primary ring-2 ring-primary ring-opacity-30"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onSelect(template.id)}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={template.imageUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="bg-primary rounded-full p-1.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
