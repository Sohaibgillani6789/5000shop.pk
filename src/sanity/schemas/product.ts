import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: () => "🏷️",
  fields: [
    defineField({
      name: "title",
      title: "Product Title",
      type: "string",
      description: "The display name of the product",
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier (auto-generated from title)",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (PKR)",
      type: "number",
      description: "Selling price in Pakistani Rupees — must be under ₨5,000",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(5000)
          .error("Price must be between ₨1 and ₨5,000"),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price (PKR)",
      type: "number",
      description:
        "Original/higher price for showing discount (optional). Must be higher than selling price.",
      validation: (Rule) => Rule.min(1).max(50000),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Which category does this product belong to?",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      description: "Primary product photo — high quality, square crop recommended",
      options: {
        hotspot: true,
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Image Gallery",
      type: "array",
      description: "Additional product images (up to 6)",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "description",
      title: "Product Description",
      type: "array",
      description:
        "Rich text description — use the PAS framework (Problem → Agitate → Solution)",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      description: "Show this product prominently on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      description: "Is this product currently available?",
      initialValue: true,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Search tags for filtering (e.g. 'summer', 'trending', 'new')",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
  ],
  orderings: [
    {
      title: "Price (Low → High)",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price (High → Low)",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Title (A → Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      media: "image",
      categoryName: "category.name",
      inStock: "inStock",
    },
    prepare({ title, price, media, categoryName, inStock }) {
      const stockLabel = inStock ? "✅" : "❌";
      return {
        title: title || "Untitled Product",
        subtitle: `₨${price ?? "—"} • ${categoryName ?? "No Category"} ${stockLabel}`,
        media,
      };
    },
  },
});
