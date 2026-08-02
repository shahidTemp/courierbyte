import { Link } from '@tanstack/react-router'

const Header = () => {
    return (
        <header className="bg-[#151414] text-white">
            <div className="maxw px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Link to="/" className="text-lg font-semibold hover:text-[#ff5e14] transition-colors">
                    Arazshop
                </Link>
            </div>
        </header>
    )
}

export default Header
