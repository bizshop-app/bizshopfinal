import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Copy, RefreshCw, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { hasFeatureAccess } from "@shared/feature-access";

interface AIContentGeneratorProps {
  onContentGenerated?: (content: { description?: string; title?: string; tags?: string }) => void;
  productInfo?: {
    name?: string;
    category?: string;
    price?: number;
    features?: string[];
    tags?: string;
    description?: string;
  };
}

export function AIContentGenerator({ onContentGenerated, productInfo = {} }: AIContentGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState<{
    description?: string;
    titles?: string[];
    tags?: string[];
  }>({});
  const { toast } = useToast();
  const { user } = useAuth();
  
  const hasAIAccess = user ? hasFeatureAccess(user, 'aiContent') : false;

  const generateDescriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/generate-description", { productInfo });
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(prev => ({ ...prev, description: data.description }));
      toast({
        title: "Description Generated",
        description: "AI-generated product description is ready!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateTitlesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/generate-title", { productInfo });
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(prev => ({ ...prev, titles: data.titles }));
      toast({
        title: "Titles Generated",
        description: "AI-generated product titles are ready!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateTagsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/generate-tags", { productInfo });
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(prev => ({ ...prev, tags: data.tags }));
      toast({
        title: "Tags Generated",
        description: "AI-generated product tags are ready!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const applyContent = (type: 'description' | 'title' | 'tags', content: string) => {
    if (onContentGenerated) {
      onContentGenerated({ [type]: content });
    }
    toast({
      title: "Applied!",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been applied to your product`,
    });
  };

  const isLoading = generateDescriptionMutation.isPending || 
                   generateTitlesMutation.isPending || 
                   generateTagsMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Info Summary */}
        {productInfo.name && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Generating content for:</p>
            <p className="font-medium">{productInfo.name}</p>
            {productInfo.category && (
              <p className="text-sm text-gray-500">Category: {productInfo.category}</p>
            )}
            {productInfo.price && (
              <p className="text-sm text-gray-500">Price: ₹{productInfo.price}</p>
            )}
          </div>
        )}

        {/* Premium Feature Notice */}
        {!hasAIAccess && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="font-medium text-purple-900">Premium Feature</h3>
                <p className="text-sm text-purple-700">
                  AI content generation is available with Premium plans. Upgrade to unlock intelligent content creation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => generateDescriptionMutation.mutate()}
            disabled={isLoading || !productInfo.name || !hasAIAccess}
            variant="outline"
            className="flex items-center gap-2"
          >
            {generateDescriptionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hasAIAccess ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Generate Description
          </Button>

          <Button
            onClick={() => generateTitlesMutation.mutate()}
            disabled={isLoading || !productInfo.name || !hasAIAccess}
            variant="outline"
            className="flex items-center gap-2"
          >
            {generateTitlesMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hasAIAccess ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Generate Titles
          </Button>

          <Button
            onClick={() => generateTagsMutation.mutate()}
            disabled={isLoading || !productInfo.name || !hasAIAccess}
            variant="outline"
            className="flex items-center gap-2"
          >
            {generateTagsMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hasAIAccess ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Generate Tags
          </Button>
        </div>

        {/* Generated Description */}
        {generatedContent.description && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Generated Description</Label>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm mb-3">{generatedContent.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generatedContent.description!)}
                  variant="outline"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={() => applyContent('description', generatedContent.description!)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply to Product
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Titles */}
        {generatedContent.titles && generatedContent.titles.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Generated Titles</Label>
            <div className="space-y-2">
              {generatedContent.titles.map((title, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm mb-2">{title}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(title)}
                      variant="outline"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => applyContent('title', title)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Use This Title
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Tags */}
        {generatedContent.tags && generatedContent.tags.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Generated Tags</Label>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex flex-wrap gap-2 mb-3">
                {generatedContent.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generatedContent.tags!.join(', '))}
                  variant="outline"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
                <Button
                  size="sm"
                  onClick={() => applyContent('tags', generatedContent.tags!.join(', '))}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Apply Tags
                </Button>
              </div>
            </div>
          </div>
        )}

        {!productInfo.name && (
          <div className="text-center text-gray-500 text-sm">
            Enter product information to generate AI content
          </div>
        )}
      </CardContent>
    </Card>
  );
}