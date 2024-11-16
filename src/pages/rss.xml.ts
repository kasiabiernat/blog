import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { PAGES } from "@consts";

type Context = {
  site: string
}

export async function GET(context: Context) {
  const blog = (await getCollection("blog"))
  .filter(post => !post.data.draft);

  const talks = (await getCollection("talks"))
    .filter(project => !project.data.draft);

  const items = [...blog, ...talks]
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  return rss({
    title: PAGES.HOME.TITLE,
    description: PAGES.HOME.DESCRIPTION,
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${item.collection}/${item.slug}/`,
    })),
  });
}
