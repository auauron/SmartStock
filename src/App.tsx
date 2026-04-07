import { RouterProvider } from "react-router";
import { router } from "./router";
import { InstallPrompt } from "./components/pwa/InstallPrompt";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <InstallPrompt />
    </>
  );
}
