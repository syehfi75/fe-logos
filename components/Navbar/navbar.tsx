import Link from "next/link";

function Navbar() {
  return (
    <>
      <nav className="relative z-10 flex items-center justify-between p-4 bg-transparent text-white font-grostek">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-lg">
              Logo
            </a>
            <a href="#" className="text-lg">
              Membership
            </a>
            <a href="#" className="text-lg">
              Categories
            </a>
            <a href="#" className="text-lg">
              Community
            </a>
            <a href="#" className="text-lg">
              Results
            </a>
            <a href="#" className="text-lg">
              At Work
            </a>
            <a href="#" className="text-lg">
              Support
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href={"/login"} className="text-lg">
              Login
            </Link>
            <Link
              href="/login?state=register"
              className="text-lg border border-white px-4 py-2 rounded-full hover:bg-gray/30 hover:text-white transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
