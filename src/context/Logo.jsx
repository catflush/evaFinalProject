import { WiAlien } from "react-icons/wi";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <WiAlien className="h-6 w-6 text-white" />
      <span className="text-xl text-white font-bold">Alien</span>
    </div>
  );
};

export default Logo;
