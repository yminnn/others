import { getFilterOptions, getKeywordExplorerData } from "@/lib/data/keywords";
import { ExplorerFilters } from "@/components/keywords/explorer-filters";
import { KeywordTable } from "@/components/keywords/keyword-table";
import { SectionHeader } from "@/components/ui/section-header";

export default async function KeywordsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const params = await searchParams;
  const [keywords, options] = await Promise.all([
    getKeywordExplorerData({
      search: typeof params.search === "string" ? params.search : undefined,
      region: typeof params.region === "string" ? params.region : undefined,
      sourcePlatform: typeof params.sourcePlatform === "string" ? (params.sourcePlatform as never) : undefined,
      category: typeof params.category === "string" ? (params.category as never) : undefined,
      intent: typeof params.intent === "string" ? (params.intent as never) : undefined,
      competitionLevel: typeof params.competitionLevel === "string" ? (params.competitionLevel as never) : undefined,
      productType: typeof params.productType === "string" ? (params.productType as never) : undefined,
      sort: typeof params.sort === "string" ? (params.sort as never) : undefined,
    }),
    getFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Explorer"
        title="Keyword explorer"
        description="Filter by source, intent, category, competition, and product shape to find opportunities that fit your thesis."
      />
      <ExplorerFilters searchParams={params} options={options} />
      <KeywordTable keywords={keywords} />
    </div>
  );
}
