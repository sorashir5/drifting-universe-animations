
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StabilityIndicatorProps {
  stability: number;
  onStabilityChange: (value: number) => void;
}

const StabilityIndicator = ({ 
  stability, 
  onStabilityChange 
}: StabilityIndicatorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(stability);

  const handleSave = () => {
    onStabilityChange(tempValue);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    if (stability >= 75) return "text-green-400";
    if (stability >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Popover open={isEditing} onOpenChange={setIsEditing}>
      <PopoverTrigger asChild>
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-md cursor-pointer border border-universe-point/30 z-30">
          <div className="text-sm text-gray-300">Multiverse Stability</div>
          <div className={`text-xl font-bold ${getStatusColor()}`}>
            {stability}%
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/80 backdrop-blur-md border-universe-point/30">
        <div className="space-y-4">
          <h4 className="font-medium text-center text-white">Adjust Stability</h4>
          <Slider
            value={[tempValue]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setTempValue(value[0])}
            className="py-4"
          />
          <div className="text-center text-xl font-bold text-white">
            {tempValue}%
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="border-universe-point/50 text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-universe-point hover:bg-universe-point/80 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StabilityIndicator;
