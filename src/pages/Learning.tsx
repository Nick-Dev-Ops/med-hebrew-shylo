import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMedicalTerms } from "@/hooks/queries/useMedicalTerms";
import { useCategories } from "@/hooks/queries/useCategories";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Trophy, Star, Gift, Sparkles, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageContainer, PageHeader, LoadingState, CategoryCard } from "@/components/common";

type Word = {
  id: number;
  en: string;
  he: string;
  rus: string;
  category_id?: number | null;
};

type Category = {
  id: number;
  slug: string;
  name_en: string;
  name_he: string;
  name_ru: string;
};

type GameMode = "categories" | "playing" | "finished";
type Lang = "en" | "rus";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const Learning = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { data: allWords = [], isLoading: wordsLoading } = useMedicalTerms();
  const { data: allCategories = [], isLoading: categoriesLoading } = useCategories();
  const {
    addMasteredWord,
    removeMasteredWord,
    getMasteredWordsCount,
    resetProgress,
    loading: progressLoading,
  } = useLearningProgress();

  const selectedLanguage = i18n.language.startsWith("ru") ? "rus" : "en";

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("categories");
  const [cards, setCards] = useState<Word[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>([]);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [loadingSentence, setLoadingSentence] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const currentCard = cards[currentCardIndex];

  useEffect(() => {
    if (currentCard && cards.length > 0) {
      prepareOptions();
    }
  }, [currentCardIndex, cards]);

  const startCategory = useCallback((category: Category) => {
    const categoryWords = allWords.filter((w) => w.category_id === category.id);
    if (categoryWords.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No words available in this category",
      });
      return;
    }

    const shuffled = shuffle(categoryWords);
    setCards(shuffled);
    setTotalCards(shuffled.length);
    setCurrentCardIndex(0);
    setScore(0);
    setSelectedCategory(category);
    setGameMode("playing");
    setSelectedAnswer(null);
    setFeedback(false);
    setAnsweredCorrectly(Array(shuffled.length).fill(false));
    setCurrentSentence("");
  }, [allWords, toast]);

  const prepareOptions = useCallback(() => {
    if (!currentCard) return;

    const categoryWords = allWords.filter(
      (w) => w.category_id === currentCard.category_id && w.id !== currentCard.id
    );
    
    const shuffled = shuffle(categoryWords);
    const distractors = shuffled.slice(0, 3);
    const allOptions = shuffle([currentCard, ...distractors]);
    
    setOptions(allOptions);
  }, [currentCard, allWords]);

  const handleAnswer = useCallback((answerId: number) => {
    if (feedback) return;

    setSelectedAnswer(answerId);
    setFeedback(true);

    const isCorrect = answerId === currentCard.id;
    const newAnsweredCorrectly = [...answeredCorrectly];
    newAnsweredCorrectly[currentCardIndex] = isCorrect;
    setAnsweredCorrectly(newAnsweredCorrectly);

    if (isCorrect) {
      setScore(score + 1);
      addMasteredWord(selectedCategory?.slug || "", currentCard.en);
    } else {
      removeMasteredWord(selectedCategory?.slug || "", currentCard.en);
    }
  }, [feedback, currentCard, currentCardIndex, answeredCorrectly, score, addMasteredWord, removeMasteredWord, selectedCategory]);

  const handleGetSentence = useCallback(async () => {
    if (!currentCard || loadingSentence) return;

    setLoadingSentence(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-sentence", {
        body: { word: currentCard.he },
      });

      if (error) throw error;
      
      if (data?.sentence) {
        setCurrentSentence(data.sentence);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No sentence found",
        });
      }
    } catch (error) {
      console.error("Error fetching sentence:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sentence",
      });
    } finally {
      setLoadingSentence(false);
    }
  }, [currentCard, loadingSentence, toast]);

  const handleNext = useCallback(() => {
    if (!feedback) return;

    setCurrentSentence("");
    
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setSelectedAnswer(null);
      setFeedback(false);
    } else {
      setGameMode("finished");
    }
  }, [feedback, currentCardIndex, totalCards]);

  const handleBack = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setSelectedAnswer(null);
      setFeedback(false);
      setCurrentSentence("");
    }
  }, [currentCardIndex]);

  const handleResetProgress = useCallback(async () => {
    await resetProgress();
    setShowResetDialog(false);
    toast({
      title: "Success",
      description: "Progress reset successfully",
    });
  }, [resetProgress, toast]);

  const backToCategories = useCallback(() => {
    setGameMode("categories");
    setSelectedCategory(null);
    setCards([]);
    setCurrentCardIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(false);
    setCurrentSentence("");
  }, []);

  if (wordsLoading || categoriesLoading || progressLoading) {
    return <LoadingState message={t("loading")} />;
  }

  if (gameMode === "categories") {
    return (
      <PageContainer>
        <Helmet>
          <title>{t("nav_learning")} - Medical Hebrew</title>
        </Helmet>
        
        <PageHeader
          title={t("nav_learning")}
        />

        <div className="flex justify-end mb-6">
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Progress</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset all your learning progress? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetProgress}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCategories.map((category) => {
            const categoryWords = allWords.filter((w) => w.category_id === category.id);
            const masteredCount = getMasteredWordsCount(category.slug);
            const progress = categoryWords.length > 0 
              ? Math.round((masteredCount / categoryWords.length) * 100) 
              : 0;

            return (
              <CategoryCard
                key={category.id}
                title={category.name_en}
                description={`${categoryWords.length} words`}
                progress={progress}
                onClick={() => startCategory(category)}
              />
            );
          })}
        </div>
      </PageContainer>
    );
  }

  if (gameMode === "finished" && selectedCategory) {
    const percentage = totalCards > 0 ? (score / totalCards) * 100 : 0;
    const getScoreMessage = () => {
      if (percentage >= 80) return "Excellent! You're a medical genius!";
      if (percentage >= 60) return "Great job! You know your terms!";
      if (percentage >= 40) return "Not bad! Keep learning!";
      return "Keep studying and try again!";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Helmet>
          <title>{t("nav_learning")} - Medical Hebrew</title>
        </Helmet>
        <Card className="w-full max-w-3xl mx-auto shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardContent className="text-center pb-8 p-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-full blur-xl animate-ping"></div>
              <div className="relative flex justify-center">
                <div className="animate-bounce">
                  <Trophy className="w-20 h-20 text-primary drop-shadow-lg" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Congratulations!
            </h1>
            <p className="text-muted-foreground text-lg">
              {selectedCategory.name_en} completed!
            </p>
          </CardContent>
          <CardContent className="space-y-8 p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-gradient-to-br from-card to-primary/5 rounded-2xl p-8 border border-primary/20">
                <div className="text-center space-y-4">
                  <div className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {score}/{totalCards}
                  </div>
                  <div className="text-2xl text-muted-foreground font-medium">
                    {Math.round(percentage)}% Correct
                  </div>
                  <div className="flex justify-center space-x-1 mt-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-300 ${
                          i < Math.ceil((score / totalCards) * 5) ? "animate-pulse" : ""
                        }`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <Star
                          className={`w-10 h-10 ${
                            i < Math.ceil((score / totalCards) * 5)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted/30"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-primary/10 to-primary/5 rounded-full px-6 py-3 border border-primary/20">
                <span className="text-lg font-medium">{getScoreMessage()}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={() => startCategory(selectedCategory)}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Try Again
              </Button>
              <Button
                onClick={backToCategories}
                variant="outline"
                size="lg"
                className="hover:bg-accent transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameMode === "playing" && currentCard && options.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Helmet>
          <title>{t("nav_learning")} - Medical Hebrew</title>
        </Helmet>
        
        <Card className="w-full max-w-3xl mx-auto shadow-xl border bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground font-medium">
                Card {currentCardIndex + 1} of {totalCards}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Score: {score}/{currentCardIndex || 0}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {cards.slice(0, Math.min(cards.length, 10)).map((_, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div
                      className={`relative transition-all duration-500 ${
                        index <= currentCardIndex ? "animate-bounce" : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Gift
                        className={`w-8 h-8 transition-all duration-300 ${
                          index < currentCardIndex
                            ? answeredCorrectly[index]
                              ? "text-green-500"
                              : "text-red-500"
                            : index === currentCardIndex
                              ? "text-primary animate-pulse"
                              : "text-muted/30"
                        }`}
                      />
                      {index < currentCardIndex && (
                        <div className="absolute -top-1 -right-1">
                          {answeredCorrectly[index] ? (
                            <CheckCircle className="w-4 h-4 text-green-500 bg-card rounded-full" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 bg-card rounded-full" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{index + 1}</div>
                  </div>
                ))}
              </div>

              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary/60 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${((currentCardIndex + (feedback ? 1 : 0)) / totalCards) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-6 leading-tight">
              {currentCard.he}
            </h2>
          </CardContent>

          <CardContent className="p-6">
            <div className="space-y-3 mb-6">
              {options.map((option) => {
                const isCorrect = option.id === currentCard.id;
                const isSelected = selectedAnswer === option.id;
                
                let buttonClass = "w-full p-4 text-left border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] rounded-lg cursor-pointer";
                let icon = null;

                if (feedback) {
                  if (isCorrect) {
                    buttonClass += " bg-green-500/10 text-green-600 dark:text-green-400 border-green-500 shadow-lg animate-pulse";
                    icon = <CheckCircle className="w-5 h-5 ml-2" />;
                  } else if (isSelected) {
                    buttonClass += " bg-red-500/10 text-red-600 dark:text-red-400 border-red-500";
                    icon = <XCircle className="w-5 h-5 ml-2" />;
                  } else {
                    buttonClass += " opacity-50";
                  }
                } else {
                  if (isSelected) {
                    buttonClass += " bg-primary/10 border-primary";
                  } else {
                    buttonClass += " hover:bg-accent border-border";
                  }
                }

                return (
                  <button
                    key={option.id}
                    className={buttonClass}
                    onClick={() => handleAnswer(option.id)}
                    disabled={!!feedback}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base font-medium">{option[selectedLanguage as Lang]}</span>
                      {icon}
                    </div>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
                <div className="text-center">
                  {selectedAnswer === currentCard.id ? (
                    <div className="text-green-600 dark:text-green-400 font-medium flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Correct! Well done!</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Correct answer:{" "}
                      <span className="font-medium text-foreground">
                        {currentCard[selectedLanguage as Lang]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentCardIndex === 0}
                className="flex items-center space-x-2 hover:bg-accent transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="text-sm text-muted-foreground">
                {feedback ? "Answer selected" : "Select an answer"}
              </div>

              <Button
                onClick={handleNext}
                disabled={!feedback}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                <span>
                  {currentCardIndex === totalCards - 1 ? "Finish" : "Next"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {currentSentence && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 backdrop-blur-sm">
                <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Example Sentence:
                </h3>
                <p className="text-foreground text-lg leading-relaxed" dir="rtl">
                  {currentSentence}
                </p>
              </div>
            )}
            
            <Button
              variant="secondary"
              onClick={handleGetSentence}
              disabled={loadingSentence}
              className="w-full mt-4 hover:bg-accent transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loadingSentence ? "Loading sentence..." : "Get Example Sentence"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Learning;
