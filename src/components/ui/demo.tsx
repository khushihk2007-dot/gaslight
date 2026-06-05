import { Component as MagicCursor } from "@/components/ui/magic-cursor";

export default function DemoOne() {
  return (
    <div
      className="w-screen h-screen bg-white overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, rgb(119, 46, 195), rgb(58, 18, 153))",
      }}
    >
      <MagicCursor />
    </div>
  );
}
