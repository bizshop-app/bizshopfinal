import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wand2, Loader2, RefreshCw, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AIDescriptionGeneratorProps {
  productName: string;
  currentDescription?: string;
  onDescriptionGenerated: (description: string) => void;
  onClose: () => void;
}

export function AIDescriptionGenerator({ 
  productName, 
  currentDescription = "", 
  onDescriptionGenerated, 
  onClose 
}: AIDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateDescription = async () => {
    if (!productName.trim()) {
      toast({
        title: "Product name required",
        description: "Please enter a product name first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/ai/generate-product-description", {
        productName: productName.trim(),
        category: productCategory.trim(),
        features: keyFeatures.trim(),
        targetAudience: targetAudience.trim(),
        tone: tone,
        existingDescription: currentDescription.trim()
      });

      const result = await response.json();
      setGeneratedDescription(result.description);
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation failed",
        description: "Unable to generate description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Description copied to clipboard",
    });
  };

  const useDescription = () => {
    onDescriptionGenerated(generatedDescription);
    onClose();
    toast({
      title: "Description applied",
      description: "AI-generated description has been added to your product",
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 h-5 w-5 text-purple-600" />
          AI Description Generator
        </CardTitle>
        <CardDescription>
          Generate compelling product descriptions with AI for "{productName}"
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              placeholder="e.g., Electronics, Clothing"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience (Optional)</Label>
            <Input
              id="audience"
              placeholder="e.g., Young professionals, Students"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Key Features (Optional)</Label>
          <Input
            id="features"
            placeholder="e.g., Wireless, Waterproof, Eco-friendly"
            value={keyFeatures}
            onChange={(e) => setKeyFeatures(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <select
            id="tone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual & Friendly</option>
            <option value="luxury">Luxury & Premium</option>
            <option value="playful">Playful & Fun</option>
            <option value="technical">Technical & Detailed</option>
          </select>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateDescription}
          disabled={isGenerating || !productName.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>

        {/* Generated Description */}
        {generatedDescription && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Description</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <Textarea
                  value={generatedDescription}
                  onChange={(e) => setGeneratedDescription(e.target.value)}
                  className="min-h-[120px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                  placeholder="Generated description will appear here..."
                />
              </div>

              <div className="flex space-x-3">
                <Button onClick={useDescription} className="flex-1">
                  Use This Description
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}