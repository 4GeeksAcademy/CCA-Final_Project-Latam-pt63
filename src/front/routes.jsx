// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Homepage } from "./pages/Homepage";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Profile } from "./pages/Profile";
import { RegisterPet } from "./pages/RegisterPet.jsx";
import { PetCard } from "./components/PetCard.jsx";
import { PetCardDetails } from "../front/components/PetCardDetails.jsx";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      { }
      <Route path="/" element={<Homepage />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      { }
      <Route path="/register-pet" element={<RegisterPet />} />
      <Route path="/pets" element={<PetCard />} />
      <Route path="/pets/:petId" element={<PetCardDetails />} />

    </Route>
  )
);