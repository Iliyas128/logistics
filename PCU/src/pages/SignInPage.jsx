import NavbarComp from "../Components/Navbar.jsx";
import SignIn from "../Components/SignIn/SignIn";

function SignInPage() {
  return(
    <div>
      <NavbarComp />
      <div className="container mt-5">
        <SignIn />
      </div>
    </div>
  )
}

export default SignInPage;