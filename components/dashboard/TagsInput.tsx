// components/dashboard/TagsInput.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  popularTags?: { tag: string; count: number }[];
}

export default function TagsInput({ 
  value, 
  onChange, 
  placeholder = "Add tags...",
  popularTags = []
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (inputValue) {
      const filtered = popularTags
        .filter(tagObj => 
          tagObj.tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(tagObj.tag)
        )
        .map(tagObj => tagObj.tag)
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, value, popularTags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const addSuggestion = (tag: string) => {
    onChange([...value, tag]);
    setInputValue("");
    setSuggestions([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      
      {suggestions.length > 0 && (
        <div className="border rounded-md p-2 bg-background">
          <p className="text-sm text-muted-foreground mb-1">Popular tags:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => addSuggestion(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}