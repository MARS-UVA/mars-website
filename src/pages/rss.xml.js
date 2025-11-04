import rss from '@astrojs/rss';
import { loadRenderers } from 'astro:container';
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { getCollection, render } from 'astro:content';

export async function GET(context) {
    const renderers = await loadRenderers([getMDXRenderer()]);
    const container = await AstroContainer.create({ renderers });

    const blog = await getCollection('blog');

    console.log(blog[0].rendered)

    return rss({
        // `<title>` field in output xml
        title: 'MARS at UVA - Mechatronics and Robotics Society',
        // `<description>` field in output xml
        description: 'UVA\'s NASA Lunabotics team. Building lunar robots, promoting STEM, and fostering engineering leaders.',
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: context.site,
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: await Promise.all(blog.map(async (post) => {
            const { Content } = await render(post);
            return {
                link: `/blog/${post.data.slug}/`,
                content: await container.renderToString(Content),
                ...post.data
            };
        })),
    });
}
