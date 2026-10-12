import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: () => "📦",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      description: "e.g. Fashion, Beauty, Electronics, Home, Accessories",
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier (auto-generated from name)",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief category description for SEO and display",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      description: "Primary visual for the category card",
      options: {
        hotspot: true, // Enables responsive cropping from Sanity Studio
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Accessibility: describe the image for screen readers",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order categories appear on the site (1 = first)",
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "color",
      title: "Brand Color",
      type: "string",
      description: "Hex color for the category card accent (e.g. #0D6B3F)",
      validation: (Rule) =>
        Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
          name: "hex color",
          invert: false,
        }),
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      order: "order",
    },
    prepare({ title, media, order }) {
      return {
        title: title || "Untitled Category",
        subtitle: `Order: ${order ?? "—"}`,
        media,
      };
    },
  },
});
