import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parse } from 'yaml';

const people = defineCollection({
  loader: glob({
    pattern: './src/content/people/*.yaml'
  }),
  schema: z.object({
    name: z.string(),
    defaultProfilePicture: z.object({
      year: z.number(),
    }).optional(),
    defaultProfessionalPicture: z.object({
      year: z.number(),
    }).optional(),
    professionalPictures: z.array(z.object({
      year: z.number(),
      src: z.string(),
    })).optional(),
    profilePictures: z.array(z.object({
      year: z.number(),
      src: z.string(),
    })).optional(),
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

const years = defineCollection({
  loader: file("./src/content/years.yaml", {
    parser: (data) => parse(data).map((item: { year: number }) => ({
      id: String(item.year),
      ...item,
    })),
  }),
  schema: z.object({
    year: z.number(),
    defaultProfilePicture: z.string(),
    subteams: z.object({
      id: z.string(),
      name: z.string(),
      photoSrc: z.string().optional(),
      show: z.boolean().optional(),
      color: z.string()
    }).array()
  })
});

export const collections = {
  people,
  blog,
  years,
};
