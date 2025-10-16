import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Book, HelpCircle, Type, Puzzle, IdCard, BookOpen, Sparkles, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getMedicalTermsWithCategories } from "@/cache/medicalTermsCache";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const features = [
	{
		nameKey: "feature_dictionary",
		path: "/Dictionary",
		descriptionKey: "feature_dictionary_desc",
		icon: BookOpen,
		color: "from-indigo-500 to-indigo-300",
	},
	{
		nameKey: "feature_quiz",
		path: "/Quiz",
		descriptionKey: "feature_quiz_desc",
		icon: HelpCircle,
		color: "from-blue-500 to-blue-300",
	},
	{
		nameKey: "feature_game",
		path: "/MatchingGame",
		descriptionKey: "feature_game_desc",
		icon: Puzzle,
		color: "from-yellow-500 to-yellow-300",
	},
];

const Home = () => {
	const { t } = useTranslation();
	const { user } = useAuth();

	useEffect(() => {
		getMedicalTermsWithCategories();
	}, []);

	return (
		<>
			<Helmet>
				<title>{t("home_title")}</title>
			</Helmet>

			<main className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
				{/* Hero Section with Registration CTA */}
				<section className="text-center mb-16 md:mb-20">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-6"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
							<Sparkles className="h-4 w-4" />
							<span>{t("learn_medical_hebrew", "Master Medical Hebrew")}</span>
						</div>
						
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
							{t("home_title")}
						</h1>
						
						<p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							{t("home_description")}
						</p>

						{!user ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
							>
								<Link to="/auth">
									<Button size="lg" className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all">
										{t("get_started_free", "Get Started Free")}
									</Button>
								</Link>
								<Link to="/Dictionary">
									<Button size="lg" variant="outline" className="text-base px-8 py-6">
										{t("explore_dictionary", "Explore Dictionary")}
									</Button>
								</Link>
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
							>
								<Link to="/Learning">
									<Button size="lg" className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all">
										{t("continue_learning", "Continue Learning")}
									</Button>
								</Link>
								<Link to="/MatchingGame">
									<Button size="lg" variant="outline" className="text-base px-8 py-6">
										{t("play_game", "Play Game")}
									</Button>
								</Link>
							</motion.div>
						)}

						{/* Social Proof */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground"
						>
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-primary" />
								<span>{t("join_learners", "Join learners worldwide")}</span>
							</div>
							<div className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5 text-primary" />
								<span>{t("improve_skills", "Improve your skills")}</span>
							</div>
						</motion.div>
					</motion.div>
				</section>

				{/* Benefits Section */}
				<section className="mb-16 md:mb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
							{t("home_what_can_do")}
						</h2>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
							{t("home_comprehensive_learning", "A comprehensive platform to master medical Hebrew through interactive learning")}
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<motion.div
									key={feature.nameKey}
									whileHover={{ scale: 1.03, y: -5 }}
									whileTap={{ scale: 0.98 }}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
								>
									<Link to={feature.path}>
										<Card className="h-full overflow-hidden border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur">
											<div className={`h-40 flex items-center justify-center bg-gradient-to-br ${feature.color} relative overflow-hidden`}>
												<div className="absolute inset-0 bg-black/5" />
												<Icon size={56} className="relative z-10 text-white drop-shadow-lg" />
											</div>
											<CardHeader className="space-y-3">
												<CardTitle className="text-xl">{t(feature.nameKey)}</CardTitle>
												<CardDescription className="text-base leading-relaxed">
													{t(feature.descriptionKey)}
												</CardDescription>
											</CardHeader>
										</Card>
									</Link>
								</motion.div>
							);
						})}
					</div>
				</section>

				{/* Final CTA Section */}
				{!user && (
					<motion.section
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
					>
						<h2 className="text-2xl md:text-3xl font-bold mb-4">
							{t("ready_to_start", "Ready to Start Your Learning Journey?")}
						</h2>
						<p className="text-muted-foreground mb-6 max-w-xl mx-auto">
							{t("join_today", "Join today and get access to all learning materials, games, and personalized progress tracking")}
						</p>
						<Link to="/auth">
							<Button size="lg" className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all">
								{t("create_free_account", "Create Free Account")}
							</Button>
						</Link>
					</motion.section>
				)}
			</main>
		</>
	);
};

export default Home;
