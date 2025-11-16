import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useMedicalTerms } from "@/hooks/queries/useMedicalTerms";
import { useCategories } from "@/hooks/queries/useCategories";
import Fuse from "fuse.js";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/common";

type Category = {
  id: number;
  slug: string;
  name_en: string;
  name_he: string;
  name_ru: string;
};

type Word = {
  en: string;
  he: string;
  rus: string;
  category_id?: number | number[];
  category?: Category | null;
};

const Dictionary = () => {
  const { t, i18n } = useTranslation();
  const { data: allWords = [], isLoading: wordsLoading } = useMedicalTerms();
  const { data: allCategories = [], isLoading: categoriesLoading } = useCategories();

  const [rawWords, setRawWords] = useState<Word[]>([]);       // <— Original words (never filtered)
  const [filteredWords, setFilteredWords] = useState<Word[]>([]); // <— Filtered output
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loading = wordsLoading || categoriesLoading;

  // -------------------------------------
  // 1) Build RAW words list (stable base)
  // -------------------------------------
  useEffect(() => {
    if (!allWords.length || !allCategories.length) return;

    const validCategories = allCategories.filter(
      (cat) => cat.name_ru !== "Фразы для пациентов"
    );
    setCategories(validCategories);

    const mapped = allWords
      .filter((w) => {
        const catIds = Array.isArray(w.category_id) ? w.category_id : [w.category_id];
        return !catIds.includes(5);
      })
      .map((w) => {
        const ids = Array.isArray(w.category_id) ? w.category_id : [w.category_id];
        const matchedCategory =
          ids.length === 0 || ids[0] == null
            ? null
            : validCategories.find((c) => ids.includes(c.id)) ?? null;

        return { ...w, category: matchedCategory };
      })
      .sort((a, b) => {
        const aId = a.category?.id ?? 999999;
        const bId = b.category?.id ?? 999999;
        return aId - bId;
      });

    setRawWords(mapped);
    setFilteredWords(mapped);   // initialize view
  }, [allWords, allCategories]);

  // -------------------------------------
  // 2) Apply Filters to rawWords
  // -------------------------------------
  useEffect(() => {
    if (!rawWords.length) {
      setFilteredWords([]);
      return;
    }

    let filtered = [...rawWords];

    // Category filtering
    if (selectedCategory) {
      filtered = filtered.filter((w) => {
        if (Array.isArray(w.category_id)) {
          return w.category_id.map(String).includes(selectedCategory);
        }
        return w.category_id?.toString() === selectedCategory;
      });
    }

    // Search filtering
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ["he", "en", "rus"],
        threshold: 0.3,
        ignoreLocation: true,
      });
      filtered = fuse.search(searchQuery.trim()).map((r) => r.item);
    }

    setFilteredWords(filtered);
  }, [selectedCategory, searchQuery, rawWords]);

  const getCategoryLabel = (cat: Category | null) => {
    if (!cat) return "";
    switch (i18n.language) {
      case "he":
        return cat.name_he;
      case "ru":
        return cat.name_ru;
      default:
        return cat.name_en;
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("dictionary_title")}</title>
        <meta name="description" content={t("dictionary_description")} />
      </Helmet>

      <PageContainer maxWidth="6xl" className="py-10">
        <header className="text-center mb-8">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("dictionary_title")}
          </motion.h1>
        </header>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Input
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-[200px]"
          />

          <select
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="">{t("all_categories")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getCategoryLabel(cat)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center mt-10">{t("loading")}</p>
        ) : filteredWords.length === 0 ? (
          <p className="text-center mt-10">{t("no_words")}</p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map((word) => (
              <motion.div key={word.he} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{word.he}</CardTitle>
                    <CardDescription>
                      EN: {word.en} <br />
                      RU: {word.rus} <br />
                      {getCategoryLabel(word.category)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </section>
        )}
      </PageContainer>
    </>
  );
};

export default Dictionary;
