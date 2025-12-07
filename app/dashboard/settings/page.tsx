// app/dashboard/settings/page.tsx
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground max-w-2xl">
          Manage your blog settings and preferences.
        </p>
      </div>

      <div className="grid gap-8">
        {/* General Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="blog-title">Blog Title</Label>
              <Input id="blog-title" defaultValue="My Blog" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="blog-description">Blog Description</Label>
              <Input id="blog-description" defaultValue="A blog about web development" />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input id="meta-title" defaultValue="My Blog - Web Development" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Input id="meta-description" defaultValue="A blog about web development and programming" />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for new comments</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newsletter">Newsletter Subscription</Label>
                <p className="text-sm text-muted-foreground">Allow users to subscribe to your newsletter</p>
              </div>
              <Switch id="newsletter" defaultChecked />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}