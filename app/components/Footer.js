import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-[#030522] text-white w-full pt-16 pb-8">
      <div className="max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

        {/* LOGO + DESCRIPTION */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <FontAwesomeIcon icon={faGraduationCap} className="text-[#3772FF] text-2xl" />
            <h2 className="font-heading text-2xl font-bold text-[#3772FF]">
              Dis-Hub
            </h2>
          </div>

          <p className="font-body text-sm text-gray-300 mt-4 max-w-sm">
            Dis-Hub is your central platform for accessing dissertations and academic research across Uganda Martyrs University campuses. Empowering students through knowledge.
          </p>
        </div>

        {/* NAV LINKS */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-heading text-lg text-[#3772FF] mb-4">
            Quick Links
          </h3>

          <ul className="font-body space-y-2 text-gray-300">
            <li>
              <Link href="#" className="hover:text-[#3772FF] transition">
                Browse
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#3772FF] transition">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#3772FF] transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#3772FF] transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* SOCIALS */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-heading text-lg text-[#3772FF] mb-4">
            Connect With Us
          </h3>

          <div className="flex justify-center md:justify-start gap-4 text-xl">

            <a href="#" className="hover:text-[#3772FF] transition">
              <FontAwesomeIcon icon={faFacebook} />
            </a>

            <a href="#" className="hover:text-[#3772FF] transition">
              <FontAwesomeIcon icon={faTwitter} />
            </a>

            <a href="#" className="hover:text-[#3772FF] transition">
              <FontAwesomeIcon icon={faInstagram} />
            </a>

            <a href="#" className="hover:text-[#3772FF] transition">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>

            <a href="#" className="hover:text-[#3772FF] transition">
              <FontAwesomeIcon icon={faGithub} />
            </a>

          </div>

          <p className="font-body text-xs text-gray-400 mt-6">
            Stay connected for updates, research tips, and academic insights.
          </p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400 font-body">
        © {new Date().getFullYear()} Dis-Hub. All rights reserved.
      </div>
    </footer>
  );
}