"use client";
const Equalizer = ({ eqBars }: { eqBars: number[] }) => (
  <div className="flex justify-center items-center gap-1 h-8 w-8 rounded-full bg-amber-200 mb-2">
    <div
      style={{ height: `${eqBars[3]}px` }}
      className="bg-green-500 w-1 max-h-[60%] rounded transition-all duration-100"
    ></div>
    <div
      style={{ height: `${eqBars[1]}px` }}
      className="bg-green-500 w-1 max-h-[80%]  rounded transition-all duration-100"
    ></div>
    <div
      style={{ height: `${eqBars[2]}px` }}
      className="bg-green-500 w-1 max-h-[60%]  rounded transition-all duration-100"
    ></div>
  </div>
);

export default Equalizer;
