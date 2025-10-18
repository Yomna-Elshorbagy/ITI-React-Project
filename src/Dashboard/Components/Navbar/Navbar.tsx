import React, { type ChangeEvent } from "react";
import { Home, Moon, Sun, FileDown, FileUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // handle import
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        console.log("Imported JSON:", json);
        // api calls here
      } catch (err) {
        console.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  //handle export
  const handleExport = () => {
    const data = { example: "Dashboard Export Data" };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  // handle home redirect
  const handleHomeRedirect = () => {
    navigate("/home");
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-md rounded-2xl px-6 py-4">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="flex items-center gap-3">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={handleHomeRedirect}
        >
          <Home size={18} />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Moon size={18} />
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <FileDown size={16} /> Export 
        </button>

        <label className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
          <FileUp size={16} /> Import 
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        <button className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <Plus size={16} /> Add Seller
        </button>
      </div>
    </header>
  );
};

export default Navbar;
