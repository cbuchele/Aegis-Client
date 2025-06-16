"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOllamaSettings } from "@/lib/hooks/use-ollama-settings";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface OllamaManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OllamaManager({ open, onOpenChange }: OllamaManagerProps) {
  const { ollamaHost, setOllamaHost } = useOllamaSettings();
  const [host, setHost] = useState(ollamaHost);

  useEffect(() => {
    setHost(ollamaHost);
  }, [ollamaHost]);

  const handleSave = () => {
    if (!host.trim()) {
      toast.error("Ollama host URL cannot be empty.");
      return;
    }
    setOllamaHost(host.trim());
    onOpenChange(false);
    toast.success("Ollama settings saved. Models will be available on next reload.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ollama Settings</DialogTitle>
          <DialogDescription>
            Configure the host URL for your local Ollama server. After saving,
            your local models will appear in the model picker.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ollama-host" className="text-right">
              Host URL
            </Label>
            <Input
              id="ollama-host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="col-span-3"
              placeholder="e.g., http://localhost:11434"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 