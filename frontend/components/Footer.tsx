const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-xl font-bold mb-2">ArihantCars</h3>
                <p className="text-gray-400 mb-4">Your trusted partner for used cars.</p>
                <div className="flex justify-center space-x-4 mb-4">
                    <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                    <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                    <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                </div>
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ArihantCars. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
