import React from "react";

export default function FloatingNotes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute top-20 left-10 text-purple-300/20 text-4xl animate-bounce -z-10">
        ♪
      </div>
      <div className="absolute top-40 right-20 text-pink-300/20 text-3xl animate-pulse -z-10">
        ♫
      </div>
      <div className="absolute bottom-32 left-20 text-cyan-300/20 text-5xl animate-bounce delay-1000 -z-10">
        ♪
      </div>
      <div className="absolute bottom-20 right-10 text-purple-300/20 text-4xl animate-pulse delay-500 -z-10">
        ♫
      </div>
    </div>
  );
}
