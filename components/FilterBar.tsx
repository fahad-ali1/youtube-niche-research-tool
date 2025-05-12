import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Competitor, FilterOptions } from "@/types";
import { ExternalLink, Minus, Plus, RotateCcw } from "lucide-react";

interface FilterBarProps {
  competitors: Competitor[];
  selectedChannel: string | undefined;
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  competitors,
  selectedChannel,
  filterOptions,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  // Convert empty string to "all" for select components
  const getSelectValue = (value: string | undefined) => {
    return value === "" || value === undefined ? "all" : value;
  };

  const handleInputChange = (
    key: keyof FilterOptions,
    value: string | number
  ) => {
    // Convert "all" value to empty string for the actual filter value
    const actualValue = value === "all" ? "" : value;

    // Apply filter immediately
    onFilterChange({
      ...filterOptions,
      [key]: actualValue,
    });
  };

  const handleToggleChange = (key: keyof FilterOptions, checked: boolean) => {
    // Apply filter immediately
    onFilterChange({
      ...filterOptions,
      [key]: checked,
    });
  };

  // Find the selected competitor object
  const selectedCompetitor = selectedChannel
    ? competitors.find((comp) => comp.id === selectedChannel)
    : undefined;

  // Handle outlier multiplier adjustments
  const incrementMultiplier = () => {
    const currentValue = filterOptions.outlierMultiplier || 2;
    const newValue = Math.min(10, Math.round((currentValue + 0.2) * 10) / 10);
    handleInputChange("outlierMultiplier", newValue);
  };

  const decrementMultiplier = () => {
    const currentValue = filterOptions.outlierMultiplier || 2;
    const newValue = Math.max(1, Math.round((currentValue - 0.2) * 10) / 10);
    handleInputChange("outlierMultiplier", newValue);
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)] mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-2 p-3">
        {/* Channel Filter */}
        <div>
          <Label
            htmlFor="channelId"
            className="text-xs font-medium text-gray-600 mb-1 block"
          >
            Channel
          </Label>
          <Select
            value={getSelectValue(filterOptions.channelId)}
            onValueChange={(value) => handleInputChange("channelId", value)}
          >
            <SelectTrigger className="border border-gray-300 hover:border-[#587aff] w-full h-8 text-sm">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent className="border border-gray-300 text-sm">
              <SelectItem value="all">All Channels</SelectItem>
              {competitors.map((competitor) => (
                <SelectItem key={competitor.id} value={competitor.id}>
                  {competitor.title || competitor.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Channel Link - only shown when a channel is selected */}
          {selectedCompetitor && (
            <a
              href={selectedCompetitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-[#587aff] hover:underline mt-1 cursor-pointer"
            >
              Visit <ExternalLink className="ml-1" size={10} />
            </a>
          )}
        </div>

        {/* Sort By */}
        <div>
          <Label
            htmlFor="sortBy"
            className="text-xs font-medium text-gray-600 mb-1 block"
          >
            Sort By
          </Label>
          <Select
            value={filterOptions.sortBy || "publish_time"}
            onValueChange={(value) => handleInputChange("sortBy", value)}
          >
            <SelectTrigger className="border border-gray-300 hover:border-[#587aff] w-full h-8 text-sm">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="border border-gray-300 text-sm">
              <SelectItem value="publish_time">Date Published</SelectItem>
              <SelectItem value="view_count">Views</SelectItem>
              <SelectItem value="like_count">Likes</SelectItem>
              <SelectItem value="comment_count">Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div>
          <Label
            htmlFor="sortOrder"
            className="text-xs font-medium text-gray-600 mb-1 block"
          >
            Order
          </Label>
          <Select
            value={filterOptions.sortOrder || "desc"}
            onValueChange={(value) => handleInputChange("sortOrder", value)}
          >
            <SelectTrigger className="border border-gray-300 hover:border-[#587aff] w-full h-8 text-sm">
              <SelectValue placeholder="Order..." />
            </SelectTrigger>
            <SelectContent className="border border-gray-300 text-sm">
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Frame */}
        <div>
          <Label
            htmlFor="timeFrame"
            className="text-xs font-medium text-gray-600 mb-1 block"
          >
            Time Frame
          </Label>
          <Select
            value={getSelectValue(filterOptions.timeFrame)}
            onValueChange={(value) => handleInputChange("timeFrame", value)}
          >
            <SelectTrigger className="border border-gray-300 hover:border-[#587aff] w-full h-8 text-sm">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent className="border border-gray-300 text-sm">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1w">Last Week</SelectItem>
              <SelectItem value="2w">Last 2 Weeks</SelectItem>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="2m">Last 2 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Outlier Multiplier with +/- buttons */}
        <div>
          <Label
            htmlFor="outlierMultiplier"
            className="text-xs font-medium text-gray-600 mb-1 block"
          >
            Outlier Multiplier
          </Label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden h-8">
            <Button
              type="button"
              onClick={decrementMultiplier}
              className="px-1 h-full bg-gray-100 hover:bg-gray-200 rounded-none border-r border-gray-300 text-black"
            >
              <Minus size={14} />
            </Button>
            <Input
              id="outlierMultiplier"
              type="number"
              min="1"
              max="10"
              step="0.2"
              className="flex-1 border-0 focus-visible:ring-0 text-center h-full text-sm p-0"
              value={filterOptions.outlierMultiplier || 2}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  const roundedValue = Math.round(value * 10) / 10;
                  handleInputChange("outlierMultiplier", roundedValue);
                }
              }}
            />
            <Button
              type="button"
              onClick={incrementMultiplier}
              className="px-1 h-full bg-gray-100 hover:bg-gray-200 rounded-none border-l border-gray-300 text-black"
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>

        {/* Options and Controls - combine Outliers Only and buttons in one cell */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              id="outliersOnly"
              checked={!!filterOptions.outliersOnly}
              onCheckedChange={(checked: boolean) =>
                handleToggleChange("outliersOnly", checked)
              }
              className="data-[state=checked]:bg-[#587aff] border border-gray-200"
            />
            <Label
              htmlFor="outliersOnly"
              className="text-xs font-medium cursor-pointer"
              onClick={() =>
                handleToggleChange("outliersOnly", !filterOptions.outliersOnly)
              }
            >
              Outliers Only
            </Label>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={onResetFilters}
              variant="outline"
              className="h-6 text-xs border border-gray-300 hover:border-[#587aff] hover:text-[#587aff] px-2"
            >
              <RotateCcw size={12} className="mr-1" /> Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
