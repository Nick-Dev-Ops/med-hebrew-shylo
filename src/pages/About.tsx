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
        <title>About Us - Doctor Hebrew</title>
        <meta name="description" content="Learn about our mission to help medical students in Israel overcome language barriers and simplify Hebrew medical terminology." />
      </Helmet>

      <PageContainer maxWidth="4xl">
        <PageHeader
          title="About Doctor Hebrew"
          subtitle="Breaking language barriers in Israeli medical education"
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
                  Doctor Hebrew was born from a simple observation: international medical students in Israel face an enormous challenge 
                  not just learning medicine, but learning it in Hebrew. What started as a small project by volunteers—medical students 
                  and programmers—has grown into a comprehensive platform designed to bridge the language gap.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our team combines the firsthand experience of medical students who've struggled with Hebrew medical terminology 
                  with the technical expertise of developers passionate about education. Together, we're building tools that make 
                  learning medical Hebrew accessible, practical, and effective.
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
                  We're committed to helping medical students in Israel succeed by removing language barriers. Our mission is to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Simplify complex Hebrew medical terminology into understandable, practical language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Provide clear, accurate translations between Hebrew, English, and Russian</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Create interactive learning tools that make memorization easier and more effective</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Build a supportive community where students can learn together</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who It's For */}
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
                    <h3 className="font-semibold mb-2">International Medical Students</h3>
                    <p className="text-sm text-muted-foreground">
                      Students studying medicine in Israel who need to master medical Hebrew quickly
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-secondary/50 p-4 rounded-lg mb-3">
                      <Globe className="h-8 w-8 text-primary mx-auto" />
                    </div>
                    <h3 className="font-semibold mb-2">New Immigrants</h3>
                    <p className="text-sm text-muted-foreground">
                      Healthcare professionals transitioning to work in the Israeli medical system
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-secondary/50 p-4 rounded-lg mb-3">
                      <Languages className="h-8 w-8 text-primary mx-auto" />
                    </div>
                    <h3 className="font-semibold mb-2">Hebrew Learners</h3>
                    <p className="text-sm text-muted-foreground">
                      Anyone interested in learning medical Hebrew terminology and clinical phrases
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
                  Medical education in Israel presents unique challenges for non-native Hebrew speakers. Existing translation tools 
                  often miss the nuance of medical terminology, and traditional study methods don't account for the specific needs 
                  of students learning in a second or third language.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We saw the need for better translations, clearer explanations, and easy access to medical materials in a format 
                  that actually works for busy medical students. Doctor Hebrew fills this gap by providing purpose-built tools that 
                  understand both medicine and the challenges of language learning.
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
                  Medical education tools should be free and available to everyone who needs them
                </p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">🤝</span> Collaboration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Built by students, for students, with input from the community we serve
                </p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">💪</span> Community
                </h3>
                <p className="text-sm text-muted-foreground">
                  Together we can overcome language barriers and support each other's success
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
                We welcome developers, translators, and medical students to contribute to this project. 
                Whether you want to improve translations, add features, or help fellow students learn, 
                there's a place for you in our community.
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
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="gap-2">
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
