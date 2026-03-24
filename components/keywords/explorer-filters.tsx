import { CompetitionLevel, SourcePlatform } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ExplorerFilters({
  searchParams,
  options,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  options: { regions: string[]; categories: string[]; intents: string[]; productTypes: string[]; };
}) {
  return (
    <form className="grid gap-3 rounded-2xl border border-white/10 bg-[var(--panel)] p-5 md:grid-cols-2 xl:grid-cols-7">
      <Input name="search" defaultValue={String(searchParams.search ?? "")} placeholder="Search keywords" />
      <Select name="region" defaultValue={String(searchParams.region ?? "ALL")}>
        <option value="ALL">All regions</option>
        {options.regions.map((region) => <option key={region} value={region}>{region}</option>)}
      </Select>
      <Select name="sourcePlatform" defaultValue={String(searchParams.sourcePlatform ?? "ALL")}>
        <option value="ALL">All sources</option>
        {Object.values(SourcePlatform).map((source) => <option key={source} value={source}>{source.replaceAll("_", " ")}</option>)}
      </Select>
      <Select name="category" defaultValue={String(searchParams.category ?? "ALL")}>
        <option value="ALL">All categories</option>
        {options.categories.map((category) => <option key={category} value={category}>{category.replaceAll("_", " ")}</option>)}
      </Select>
      <Select name="intent" defaultValue={String(searchParams.intent ?? "ALL")}>
        <option value="ALL">All intent</option>
        {options.intents.map((intent) => <option key={intent} value={intent}>{intent.replaceAll("_", " ")}</option>)}
      </Select>
      <Select name="competitionLevel" defaultValue={String(searchParams.competitionLevel ?? "ALL")}>
        <option value="ALL">Competition</option>
        {Object.values(CompetitionLevel).map((level) => <option key={level} value={level}>{level}</option>)}
      </Select>
      <div className="flex gap-3">
        <Select name="productType" defaultValue={String(searchParams.productType ?? "ALL")}>
          <option value="ALL">Product type</option>
          {options.productTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}
        </Select>
        <Select name="sort" defaultValue={String(searchParams.sort ?? "opportunity")}>
          <option value="opportunity">Opportunity</option>
          <option value="growth">Growth</option>
          <option value="demand">Demand</option>
          <option value="monetization">Monetization</option>
        </Select>
      </div>
      <div className="md:col-span-2 xl:col-span-7 flex gap-3 justify-end">
        <Button type="submit">Apply filters</Button>
      </div>
    </form>
  );
}
