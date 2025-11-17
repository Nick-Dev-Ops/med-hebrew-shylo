import { Helmet } from "react-helmet-async";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Globe, Users, BookOpen, Code, Languages, Mail, Target, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us</title>
        <meta
          name="description"
          content="Learn how Med-Ivrit helps medical students, interns, and doctors whose first language is not Hebrew succeed in the Israeli medical system."
        />
      </Helmet>

      <PageContainer maxWidth="4xl">
        <PageHeader
          title="Med-Ivrit"
          subtitle="Supporting medical education for those who learn — and practice — in a language that isn't their own"
        />

        {/* Our Story */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Med-Ivrit was created by a small group of volunteers — programmers, medical students,
                  and young doctors — who saw how difficult it is to study and practice medicine in Israel
                  when Hebrew is not your first language.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Many of us went through that same struggle: trying to understand Hebrew medical
                  terminology, adapting to clinical settings, and learning fast-paced professional language.
                  We built this project so future students, interns, and immigrant doctors won’t have to face
                  those challenges alone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Mission */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our mission is simple: to help anyone in the Israeli medical world who struggles with Hebrew —
                  from first-year students to interns and practicing doctors.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Make Hebrew medical terminology understandable, clear, and easy to learn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Provide accurate translations between Hebrew, English, Russian, and more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Support medical interns and doctors adapting to Hebrew during clinical work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Create practical tools that help users study faster and navigate Israeli hospitals with confidence</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who We Serve */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Who We Serve</h2>

                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  <div className="text-center">
                    <div className="bg-secondary/50 p-4 rounded-lg mb-3">
                      <BookOpen className="h-8 w-8 text-primary mx-auto" />
                    </div>
                    <h3 className="font-semibold mb-2">Medical Students</h3>
                    <p className="text-sm text-muted-foreground">
                      Students learning medicine in Israel who need help mastering Hebrew terminology
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-secondary/50 p-4 rounded-lg mb-3">
                      <Globe className="h-8 w-8 text-primary mx-auto" />
                    </div>
                    <h3 className="font-semibold mb-2">Interns & Young Doctors</h3>
                    <p className="text-sm text-muted-foreground">
                      Medical professionals who must work in Hebrew during rounds, documentation, and patient care
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-secondary/50 p-4 rounded-lg mb-3">
                      <Languages className="h-8 w-8 text-primary mx-auto" />
                    </div>
                    <h3 className="font-semibold mb-2">New Immigrants</h3>
                    <p className="text-sm text-muted-foreground">
                      Olim and immigrants integrating into the Israeli healthcare system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why We Exist */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Why We Exist</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Studying or practicing medicine in Israel is demanding — and even more so for those who don’t speak
                  Hebrew as their first language. Medical Hebrew is fast, technical, and full of subtle meaning that
                  standard translation tools often fail to capture.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We built Med-Ivrit to provide clear explanations, accurate translations, and practical learning tools
                  for medical students, interns, and doctors. Our goal is to make medical education in Israel more
                  accessible, inclusive, and achievable for anyone building their career here — no matter what language
                  they grew up speaking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Values */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">🎯</span> Accessibility
                </h3>
                <p className="text-sm text-muted-foreground">
                  Knowledge should be available to everyone — regardless of language or background
                </p>
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">🤝</span> Collaboration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Built together with the community we aim to support
                </p>
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">💪</span> Empowerment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Helping students, interns, and doctors navigate the Israeli medical world with confidence
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Us */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <Code className="h-12 w-12 text-primary mx-auto mb-2" />
              <h2 className="text-2xl font-bold mb-2">Join Our Mission</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you're a developer, translator, medical student, intern, or doctor —
                you can help shape a better future for non-native Hebrew speakers in Israel's
                medical system.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link to="/ContactUs">
                <Button size="lg" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Get In Touch
                </Button>
              </Link>

              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Code className="h-4 w-4" />
                  Contribute on GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default About;
