import NavbarPage from "../Components/NavbarPage";
import SignUp from "../Components/SignUp/SignUp";

function SignUpPage() {
  return(
    <div>
    <NavbarPage />
    <div className="container mt-5">
      <SignUp />
    </div>
  </div>
  )
}

export default SignUpPage;
