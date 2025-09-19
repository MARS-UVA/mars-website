import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const people = defineCollection({
  loader: glob({
    pattern: './src/content/people/*.yaml'
  }),
  schema: z.object({
    name: z.string(),
    professionalPicture: z.string().optional(),
    profilePicture: z.string().optional(),
    subteams: z.array(z.object({
      id: z.string(),
      years: z.array(z.number()),
    })),
    roles: z.array(z.object({
      name: z.string(),
      subteam: z.string().optional(),
      years: z.array(z.number()),
    })).optional(),
  })
});

const blog = defineCollection({
  loader: glob({
    pattern: './src/content/blog/*.mdx'
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    slug: z.string(),
    date: z.string().transform((date) => new Date(date)),
    thumbnail: z.string(),
    draft: z.boolean().optional(),
    content: z.string().optional(),
    background: z.string().optional(),
    blurb: z.string().optional(),
  })
});

export const collections = {
  people,
  blog,
};
