import NavbarComp from "../Components/Navbar.jsx";
import SignUp from "../Components/SignUp/SignUp.jsx";

function SignUpPage() {
  return(
    <div>
      <NavbarComp />
      <div className="container mt-5">
        <SignUp />
      </div>
    </div>
  )
}

export default SignUpPage;