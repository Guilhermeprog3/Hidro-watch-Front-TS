import { useContext } from "react";
import { MeasurementContext } from "../context/measurementscontext";


export const Measurementobject = () => {
  const context = useContext(MeasurementContext);

  if (!context) {
    throw new Error("useContext must be used within an UserProvider");
  }

  return context;
};