import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, LogOut, User, GraduationCap } from "lucide-react";

type NavItem = { nameKey: string; path: string };

const navItems: NavItem[] = [
  { nameKey: "nav_home", path: "/" },
  { nameKey: "nav_learning", path: "/Learning" },
  { nameKey: "nav_quiz", path: "/Quiz" },
  { nameKey: "nav_matching_game", path: "/MatchingGame" },
  { nameKey: "nav_dictionary", path: "/Dictionary" },
  { nameKey: "nav_contactUs", path: "/ContactUs" },
];

const Navbar = () => {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user, signOut } = useAuth();
	const { t } = useTranslation(); // <-- Add this

	const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
	const closeMenu = () => setIsMobileMenuOpen(false);

	return (
		<header className="bg-background/95 border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
			<div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2 group transition-all duration-200 hover:opacity-80">
					<GraduationCap className="h-7 w-7 text-primary" />
					<h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						MED-IVRIT
					</h1>
				</Link>
				
				{/* Desktop Nav and Theme Toggle */}
				<div className="hidden lg:flex items-center gap-6">
					<nav className="flex items-center gap-1">
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
									location.pathname === item.path
										? "bg-primary/10 text-primary"
										: "text-foreground/70 hover:text-foreground hover:bg-accent"
								}`}
							>
								{t(item.nameKey)}
							</Link>
						))}
					</nav>
					<div className="flex items-center gap-2">
						<ThemeToggle />
						<LanguageSwitcher />
						{user ? (
							<>
								<Link to="/profile">
									<Button variant="ghost" size="sm" className="gap-2">
										<User className="h-4 w-4" />
										<span className="hidden xl:inline">Profile</span>
									</Button>
								</Link>
								<Button
									variant="ghost"
									size="sm"
									onClick={signOut}
									className="gap-2"
								>
									<LogOut className="h-4 w-4" />
									<span className="hidden xl:inline">Logout</span>
								</Button>
							</>
						) : (
							<Link to="/auth">
								<Button size="sm" className="gap-2">
									<User className="h-4 w-4" />
									Login
								</Button>
							</Link>
						)}
					</div>
				</div>

				{/* Mobile Menu Button */}
				<div className="lg:hidden flex items-center gap-2">
					<ThemeToggle />
					<LanguageSwitcher />
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMenu}
						className="relative"
						aria-label="Toggle menu"
					>
						{isMobileMenuOpen ? (
							<X className="h-5 w-5 transition-transform duration-200" />
						) : (
							<Menu className="h-5 w-5 transition-transform duration-200" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
					<nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={closeMenu}
								className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
									location.pathname === item.path
										? "bg-primary/10 text-primary"
										: "text-foreground/70 hover:text-foreground hover:bg-accent"
								}`}
							>
								{t(item.nameKey)}
							</Link>
						))}
						<div className="pt-4 mt-4 border-t border-border space-y-2">
							{user ? (
								<>
									<Link to="/profile" onClick={closeMenu} className="block">
										<Button variant="outline" size="sm" className="w-full justify-start gap-2">
											<User className="h-4 w-4" />
											Profile
										</Button>
									</Link>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											signOut();
											closeMenu();
										}}
										className="w-full justify-start gap-2"
									>
										<LogOut className="h-4 w-4" />
										Logout
									</Button>
								</>
							) : (
								<Link to="/auth" onClick={closeMenu}>
									<Button size="sm" className="w-full justify-start gap-2">
										<User className="h-4 w-4" />
										Login
									</Button>
								</Link>
							)}
						</div>
					</nav>
				</div>
			)}
		</header>
	);
};

export default Navbar;
