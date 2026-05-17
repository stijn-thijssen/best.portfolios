import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'portfolioType',
  title: 'Style',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
