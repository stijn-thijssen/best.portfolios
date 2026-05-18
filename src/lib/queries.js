import { sanityClient } from './sanity';

const projectFields = `
  _id,
  portfolioName,
  "slug": slug.current,
  thumbnail,
  media,
  portfolioDescription,
  portfolioLink,
  "category": category->title,
  "portfolioType": portfolioType[]->title,
  "curator": curator->{ name, image, link }
`;

export const projectsQuery = `*[_type == "project"] | order(portfolioName asc) {
  _id,
  portfolioName,
  "slug": slug.current,
  thumbnail,
  "category": category->title,
  "styles": portfolioType[]->title
}`;

export const categoriesQuery = `*[_type == "category"] | order(title asc) {
  title,
  "slug": slug.current
}`;

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  h1,
  metaTitle,
  description
}`;

export const projectsByCategorySlugQuery = `*[_type == "project" && category->slug.current == $slug] | order(portfolioName asc) {
  _id,
  portfolioName,
  "slug": slug.current,
  thumbnail,
  "styles": portfolioType[]->title
}`;

export const stylesQuery = `*[_type == "portfolioType"] | order(title asc) {
  title
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  ${projectFields}
}`;

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  title,
  metaTitle,
  h1,
  description,
  "slug": slug.current
}`;

export const projectsByCategorySlugQuery = `*[_type == "project" && category->slug.current == $slug] | order(portfolioName asc) {
  _id,
  portfolioName,
  "slug": slug.current,
  thumbnail,
  "category": category->title,
  "styles": portfolioType[]->title
}`;

export async function fetchProjects() {
  return sanityClient.fetch(projectsQuery);
}

export async function fetchCategories() {
  return sanityClient.fetch(categoriesQuery);
}

export async function fetchStyles() {
  return sanityClient.fetch(stylesQuery);
}

export async function fetchProjectBySlug(slug) {
  return sanityClient.fetch(projectBySlugQuery, { slug });
}

export async function fetchCategoryBySlug(slug) {
  return sanityClient.fetch(categoryBySlugQuery, { slug });
}

export async function fetchProjectsByCategorySlug(slug) {
  return sanityClient.fetch(projectsByCategorySlugQuery, { slug });
}
