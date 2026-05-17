import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'portfolioName',
      title: 'Portfolio name',
      description: 'Name of the portfolio',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Slug of the page',
      type: 'slug',
      options: {
        source: 'portfolioName',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'portfolioDescription',
      title: 'Portfolio description',
      description: 'Description of the portfolio',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'portfolioLink',
      title: 'Portfolio link',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'portfolioType',
      title: 'Style',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'portfolioType'}]}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'curator',
      title: 'Curator',
      type: 'reference',
      to: [{type: 'curator'}],
    }),
  ],
  preview: {
    select: {
      title: 'portfolioName',
      media: 'thumbnail',
      category: 'category.title',
    },
    prepare({title, media, category}) {
      return {
        title,
        subtitle: category,
        media,
      }
    },
  },
})
