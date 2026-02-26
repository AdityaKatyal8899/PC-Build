import { createBrowserRouter } from "react-router-dom";
import { BudgetSetup } from "./pages/BudgetSetup";
import { BuilderPage } from "./pages/BuilderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: BudgetSetup,
  },
  {
    path: "/build",
    Component: BuilderPage,
  },
]);
