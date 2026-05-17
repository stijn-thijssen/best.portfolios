import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'curator',
  title: 'Curator',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'link',
      title: 'Link',
      description: 'External link (e.g. profile or website)',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'name', media: 'image'},
  },
})
