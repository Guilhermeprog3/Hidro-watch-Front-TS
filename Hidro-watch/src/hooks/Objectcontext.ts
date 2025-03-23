import { useContext } from "react";
import { ObjectContext } from "../context/objectcontext";

export const useObject = () => {
  const context = useContext(ObjectContext);

  if (!context) {
    throw new Error("useObject must be used within an ObjectProvider");
  }

  return context;
};