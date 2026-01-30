// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Homepage } from "./pages/Homepage";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { RegisterPet } from "./pages/RegisterPet.jsx";
import { BookAppointment } from "./pages/BookAppointment";
import { PetInfo } from "./pages/PetInfo.jsx";
import { AdminClients } from "./pages/AdminClients.jsx";
import { PasswordReset } from "./pages/ResetPassword.jsx";
import { RequestReset } from "./pages/RequestReset.jsx";



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
      <Route path="/editprofile/:userId" element={<EditProfile />} />
      
      { }
      <Route path="/register-pet" element={<RegisterPet />} />
      <Route path="/book" element={<BookAppointment />} />
      <Route path="/pets/:petId" element={<PetInfo />} />

      { }
      <Route path="/private/clients" element={<AdminClients />} />
      <Route path="/reset-password/:Uuid" element={<PasswordReset />} />
      <Route path="/request-reset" element={<RequestReset />} />
    </Route>
  )
);