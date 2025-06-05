import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddChannelFormProps {
  onAddChannel: (formData: { id: string }) => Promise<void>;
}

export default function AddChannelForm({ onAddChannel }: AddChannelFormProps) {
  const [formData, setFormData] = useState({ id: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onAddChannel(formData);
    setFormData({ id: "" });
    setSubmitting(false);
  };

  return (
    <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
      <h2 className="text-2xl font-bold mb-4">Add New Channel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="id">YouTube Channel ID</Label>
            <Input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className="w-full"
              placeholder="UC..."
              disabled={submitting}
            />
            <p className="text-sm text-gray-500">Other details will be automatically fetched from YouTube</p>
          </div>
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-black text-white font-bold hover:bg-gray-800 w-full"
        >
          {submitting ? "Adding..." : "Add Channel"}
        </Button>
      </form>
    </div>
  );
}
