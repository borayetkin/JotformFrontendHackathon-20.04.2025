import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">Del Mono Fresh</h2>
            <p className="mt-2 text-gray-400">
              Order Before Midnight For Next Day Delivery!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
              <ul className="text-gray-400">
                <li className="mb-1">Phone: (123) 456-7890</li>
                <li className="mb-1">Email: orders@delmonofresh.com</li>
                <li className="mb-1">Address: 123 Produce Lane, Freshville</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
              <ul className="text-gray-400">
                <li className="mb-1">
                  <a
                    href="https://form.jotform.com/251074098711961"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    JotForm Order Page
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:text-white transition-colors">
                    Delivery Information
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Del Mono Fresh. All rights
            reserved.
          </p>
          <p className="mt-1">
            Powered by{" "}
            <a
              href="https://www.jotform.com"
              className="text-primary hover:text-blue-400 transition-colors"
            >
              JotForm
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
