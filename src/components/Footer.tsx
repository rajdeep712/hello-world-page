import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-transparent.png";

const Footer = () => {
  return (
    <footer className="py-20 bg-paper border-t border-border">
      <div className="container px-8 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/">
              <img src={logo} alt="Basho by Shivangi" className="h-10 w-auto" />
            </Link>
            <p className="font-sans text-sm text-muted-foreground max-w-sm leading-relaxed">
              Handcrafted Japanese-inspired pottery. Each piece tells a story of earth, fire, and wabi-sabi.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/bashobyyshivangi/" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="mailto:hello@basho.in" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">Explore</h4>
            <ul className="space-y-3">
              {["Products", "Workshops", "Studio", "About", "Contact"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="font-sans text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">Visit</h4>
            <div className="space-y-2 font-sans text-sm text-foreground/70">
              <p>Piplod, Surat, Gujarat</p>
              <p>Tue - Sun: 10am - 6pm</p>
              <p className="text-primary text-xs tracking-wider uppercase pt-2">By Appointment</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-muted-foreground">
            © {new Date().getFullYear()} Basho by Shivangi
          </p>
          <div className="flex gap-6">
            <span className="font-sans text-xs text-muted-foreground">Privacy Policy</span>
            <span className="font-sans text-xs text-muted-foreground">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
