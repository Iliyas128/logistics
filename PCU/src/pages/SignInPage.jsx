import NavbarPage from "../Components/NavbarPage";
import SignIn from "../Components/SignIn/SignIn";

function SignInPage() {
  return(
    <div>
      <NavbarPage />
      <div className="container mt-5">
        <SignIn />
      </div>
    </div>
  )
}

export default SignInPage;