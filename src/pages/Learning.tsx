import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedicalTerms } from "@/hooks/queries/useMedicalTerms";
import { useCategories } from "@/hooks/queries/useCategories";
import { fetchHebrewSentence } from "@/utils/fetchHebrewSentence";
import { BookOpen, ArrowLeft, Loader2, X, Volume2, RotateCcw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuthContext } from "@/context/AuthContext";
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
import { PageContainer, PageHeader, CompletionScreen, CategoryCard } from "@/components/common";

// shuffle helper
const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const Learning = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthContext();

  const { data: allWords = [] } = useMedicalTerms();
  const { data: allCategories = [] } = useCategories();

  const {
    updateWordProgress,
    getAllCategoryProgress,
    resetProgress
  } = useUserProgress();

  const targetLang = i18n.language.startsWith("ru") ? "rus" : "en";

  const [categories, setCategories] = useState([]);
  const [words, setWords] = useState([]);
  const [categoryProgress, setCategoryProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [answersMap, setAnswersMap] = useState({});

  const [gameMode, setGameMode] = useState("categories");

  /**
   * Load data ONCE — compute progress entirely on frontend
   */
  useEffect(() => {
    if (!allWords.length || !allCategories.length || !user) return;

    setWords(allWords);
    setCategories(allCategories);

    const categoriesWithCounts = allCategories.map(c => ({
      id: c.id,
      totalWords: allWords.filter(w => w.category_id === c.id).length
    }));

    const progress = getAllCategoryProgress(allWords, categoriesWithCounts);
    setCategoryProgress(progress);

  }, [allWords, allCategories, user, getAllCategoryProgress]);
  /** Prepare multiple-choice options */
  const prepareOptions = useCallback((word) => {
    const wrongAnswers = words
      .filter(w => w.he !== word.he)
      .map(w => w.he)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setOptions([word.he, ...wrongAnswers].sort(() => Math.random() - 0.5));
    setShowAnswer(false);
    setFeedback("");
  }, [words]);

  /** Start category */
  const startCategory = (category) => {
    const categoryWords = words.filter(w => w.category_id === category.id);
    if (!categoryWords.length) return;

    const shuffled = shuffle(categoryWords);
    setDeck(shuffled);
    setSelectedCategory(category);
    setCurrentIndex(0);
    setGameMode("playing");

    prepareOptions(shuffled[0]);
  };

  /** Handle user selecting an answer */
  const handleAnswer = async (selected) => {
    const currentWord = deck[currentIndex];
    const isCorrect = selected === currentWord.he;

    setShowAnswer(true);
    setShowNext(true);
    setAnswersMap(prev => ({ ...prev, [currentIndex]: selected }));

    if (isCorrect) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect. Correct answer: ${currentWord.he}`);
    }

    if (user) {
      await updateWordProgress(currentWord.id, isCorrect);
    }
  };

  /** Next card */
  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= deck.length) {
      setGameMode("finished");
      return;
    }

    setCurrentIndex(nextIndex);
    setShowAnswer(false);
    setShowNext(false);
    setFeedback("");
    setOptions([]);

    prepareOptions(deck[nextIndex]);

    // Restore answer if user navigates back
    const prevAnswer = answersMap[nextIndex];
    if (prevAnswer) {
      const correct = prevAnswer === deck[nextIndex].he;
      setShowAnswer(true);
      setShowNext(true);
      setFeedback(correct ? "✅ Correct!" : `❌ Incorrect. Correct answer: ${deck[nextIndex].he}`);
    }
  };

  /** Previous card navigation */
  const handleBack = () => {
    if (currentIndex === 0) return;

    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);

    prepareOptions(deck[prevIndex]);

    const prevAnswer = answersMap[prevIndex];
    if (prevAnswer) {
      const correct = prevAnswer === deck[prevIndex].he;
      setShowAnswer(true);
      setShowNext(true);
      setFeedback(correct ? "✅ Correct!" : `❌ Correct answer: ${deck[prevIndex].he}`);
    } else {
      setShowAnswer(false);
      setShowNext(false);
      setFeedback("");
    }
  };

  /** Reset all user progress */
  const handleResetProgress = async () => {
    await resetProgress();

    const categoriesWithCounts = categories.map(c => ({
      id: c.id,
      totalWords: words.filter(w => w.category_id === c.id).length
    }));

    const progress = getAllCategoryProgress(words, categoriesWithCounts);
    setCategoryProgress(progress);
  };

  /** Return to category menu */
  const backToCategories = () => {
    setGameMode("categories");
    setSelectedCategory(null);
    setDeck([]);
    setCurrentIndex(0);
    setFeedback("");
    setAnswersMap({});
    setShowAnswer(false);
    setShowNext(false);
  };

  /** RENDERING */

  if (gameMode === "categories") {
    return (
      <>
        <Helmet><title>Card Game</title></Helmet>

        <PageContainer maxWidth="6xl" className="space-y-8">
          <PageHeader
            title={t("learning_header", "Card Game")}
            subtitle={t("learning_subtitle", "Pick a category and test your knowledge.")}
            actions={
              user && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetProgress}>
                        Reset Progress
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const wordsInCategory = words.filter(w => w.category_id === cat.id);
              const progress = categoryProgress[cat.id] || 0;

              const name = i18n.language === "he"
                ? cat.name_he
                : i18n.language.startsWith("ru")
                  ? cat.name_ru
                  : cat.name_en;

              return (
                <CategoryCard
                  key={cat.id}
                  title={name}
                  description={`${wordsInCategory.length} ${t("terms", "terms")}`}
                  progress={progress}
                  icon={BookOpen}
                  onClick={() => startCategory(cat)}
                />
              );
            })}
          </div>
        </PageContainer>
      </>
    );
  }

  if (gameMode === "finished") {
    return (
      <CompletionScreen
        emoji="🎉"
        title={t("finished", "All done!")}
        description={t("you_completed", "You have completed all words in this category.")}
        onAction={backToCategories}
        actionLabel={t("back_to_categories", "Back to Categories")}
      />
    );
  }

  const currentWord = deck[currentIndex];

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <header className="flex items-center justify-between">
        <Button variant="outline" onClick={backToCategories}>
          <ArrowLeft className="h-4 w-4" /> {t("back", "Back")}
        </Button>

        <div className="text-center">
          <h1 className="text-xl font-bold">
            {i18n.language === "he"
              ? selectedCategory?.name_he
              : i18n.language.startsWith("ru")
                ? selectedCategory?.name_ru
                : selectedCategory?.name_en}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("progress", "Progress")}: {currentIndex + 1} / {deck.length}
          </p>
        </div>
      </header>

      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{currentWord[targetLang]}</CardTitle>
          <CardDescription>{t("select_hebrew", "Select the correct Hebrew translation")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {options.map(opt => {
              const isCorrect = opt === currentWord.he;
              const isSelected = answersMap[currentIndex] === opt;

              let variant = "outline";
              if (showAnswer) {
                if (isCorrect) variant = "default";
                else if (isSelected) variant = "destructive";
              }

              return (
                <Button
                  key={opt}
                  variant={variant}
                  size="lg"
                  disabled={showAnswer}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </div>

          {feedback && (
            <div className="p-3 text-center font-medium bg-muted border rounded">
              {feedback}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button variant="outline" disabled={currentIndex === 0} onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" /> {t("previous", "Previous")}
            </Button>
            <Button variant="default" disabled={!showNext} onClick={handleNext}>
              {t("next", "Next")}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Learning;
