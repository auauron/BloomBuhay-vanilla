import React from "react";
import { CircleArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SetupHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackClick?: () => void;
}

export default function SetupHeader({
  title = "BloomBuhay",
  showBack = true,
  onBackClick,
}: SetupHeaderProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    navigate(-1);
  };

  return (
    <header className="fixed top-0 left-0 flex flex-row bg-bloomWhite shadow-none items-center w-full py-4 px-6 z-20">
      <div className="flex items-center space-x-4">
        {showBack && (
          <CircleArrowLeftIcon
            size={32}
            className="cursor-pointer text-bloomWhite fill-bloomPink"
            onClick={handleBack}
          />
        )}
        <h1 className="text-3xl font-bold text-bloomPink">{title}</h1>
        <img
          src="/assets/logo_pink.png"
          alt="Logo"
          style={{ width: "34px", height: "34px" }}
          className="object-contain"
        />
      </div>
    </header>
  );
}
