import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Competitor } from "@/types";
import { ExternalLink, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";

interface CompetitorsListProps {
  competitors: Competitor[];
  competitorStats: Record<string, number>;
  selectedChannel: string | null;
  loading: boolean;
  onChannelClick: (channelId: string) => void;
  onDeleteChannel: (id: string) => Promise<void>;
  onUpdateChannel: (editFormData: { id: string; url: string; title: string; profilePic: string }) => Promise<void>;
}

export default function CompetitorsList({
  competitors,
  competitorStats,
  selectedChannel,
  loading,
  onChannelClick,
  onDeleteChannel,
  onUpdateChannel,
}: CompetitorsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: "",
    url: "",
    title: "",
    profilePic: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sort competitors: channels without titles first, then alphabetically by title
  const sortedCompetitors = [...competitors].sort((a, b) => {
    // If neither has a title, sort by ID
    if (!a.title && !b.title) {
      return a.id.localeCompare(b.id);
    }
    // If a doesn't have a title, it comes first
    if (!a.title) return -1;
    // If b doesn't have a title, it comes first
    if (!b.title) return 1;
    // Both have titles, sort alphabetically
    return a.title.localeCompare(b.title);
  });

  const filteredCompetitors =
    searchQuery.trim() === ""
      ? sortedCompetitors
      : sortedCompetitors.filter(
          (comp) =>
            (comp.title?.toLowerCase() || "").includes(
              searchQuery.toLowerCase()
            ) || comp.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChannel = (competitor: Competitor) => {
    setEditingChannelId(competitor.id);
    setEditFormData({
      id: competitor.id,
      url: competitor.url,
      title: competitor.title || "",
      profilePic: competitor.profilePic || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingChannelId(null);
    setEditFormData({ id: "", url: "", title: "", profilePic: "" });
  };

  const handleUpdateChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onUpdateChannel(editFormData);
      setEditingChannelId(null);
      setEditFormData({ id: "", url: "", title: "", profilePic: "" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-bold mb-4">Competitors</h2>

      {/* Search input */}
      <div className="mb-4">
        <Input
          placeholder="Search competitors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-black"
        />
      </div>

      {loading ? (
        <p>Loading competitors...</p>
      ) : competitors.length === 0 ? (
        <p className="text-gray-500">No competitors found</p>
      ) : (
        <div className="h-[400px] overflow-y-auto border-2 border-black rounded-lg">
          <ul className="space-y-2 p-2">
            {filteredCompetitors.map((competitor) => (
              <li
                key={competitor.id}
                className={`
                  p-4 border-2 border-black rounded-lg 
                  ${
                    selectedChannel === competitor.id
                      ? "bg-blue-50"
                      : "bg-white"
                  }
                  hover:bg-gray-50 cursor-pointer transition-colors
                `}
              >
                {editingChannelId === competitor.id ? (
                  <form
                    onSubmit={handleUpdateChannelSubmit}
                    className="space-y-2"
                  >
                    <div>
                      <Label
                        htmlFor="edit-id"
                        className="text-sm font-bold"
                      >
                        Channel ID
                      </Label>
                      <Input
                        id="edit-id"
                        name="id"
                        value={editFormData.id}
                        onChange={handleEditInputChange}
                        className="border-2 border-black mt-1"
                        disabled
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="edit-url"
                        className="text-sm font-bold"
                      >
                        Channel URL
                      </Label>
                      <Input
                        id="edit-url"
                        name="url"
                        value={editFormData.url}
                        onChange={handleEditInputChange}
                        className="border-2 border-black mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="edit-title"
                        className="text-sm font-bold"
                      >
                        Channel Title
                      </Label>
                      <Input
                        id="edit-title"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditInputChange}
                        className="border-2 border-black mt-1"
                      />
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                      >
                        <Check size={16} />
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-1"
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-grow"
                      onClick={() => onChannelClick(competitor.id)}
                    >
                      <p className="font-bold">
                        {competitor.title || competitor.id}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="truncate" title={competitor.url}>
                          {competitor.url.length > 40
                            ? `${competitor.url.substring(0, 37)}...`
                            : competitor.url}
                        </span>
                        <a
                          href={competitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className="mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full inline-block">
                        {competitorStats[competitor.id] !== undefined
                          ? `${competitorStats[competitor.id]} videos`
                          : "Update to get stats"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditChannel(competitor);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-500 text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChannel(competitor.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
