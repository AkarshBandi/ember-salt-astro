// tina/config.ts
import { defineConfig } from "tinacms";

// src/components/blocks/hero.template.ts
var heroBlockSchema = {
  name: "hero",
  label: "Hero",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Miles label", name: "miles" },
    { type: "string", label: "Tagline", name: "tagline", ui: { component: "textarea" } },
    { type: "string", label: "Primary button label", name: "primaryLabel" },
    { type: "string", label: "Primary button link", name: "primaryLink" },
    { type: "string", label: "Secondary button label", name: "secondaryLabel" },
    { type: "string", label: "Secondary button link", name: "secondaryLink" },
    { type: "string", label: "Scroll note", name: "scrollNote" },
    {
      type: "object",
      label: "Plate image",
      name: "plateImage",
      fields: [
        { name: "src", label: "Image source", type: "image" },
        { name: "alt", label: "Alt text", type: "string" }
      ]
    }
  ],
  ui: {
    defaultItem: {
      eyebrow: "Woodfire & fermentation \u2014 Portland",
      miles: "40 miles",
      tagline: "Twelve courses. Fourteen seats. One oak kiln.",
      primaryLabel: "Read the menu",
      primaryLink: "/menu/",
      secondaryLabel: "Secure a table",
      secondaryLink: "/visit/",
      scrollNote: "Scroll slowly"
    }
  }
};

// src/components/blocks/marquee.template.ts
var marqueeBlockSchema = {
  name: "marquee",
  label: "Press marquee",
  fields: [
    {
      type: "object",
      label: "Items",
      name: "phrases",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text ?? "Item" }),
        defaultItem: { text: "Twelve courses" }
      },
      fields: [{ type: "string", label: "Text", name: "text" }]
    }
  ],
  ui: {
    defaultItem: {
      items: [
        { text: "Twelve courses" },
        { text: "Within forty miles" },
        { text: "Oak woodfire" },
        { text: "Natural pairings" },
        { text: "House fermentation" }
      ]
    }
  }
};

// src/components/blocks/courses.template.ts
var coursesBlockSchema = {
  name: "courses",
  label: "Tasting courses",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline" },
    { type: "string", label: "Description", name: "description", ui: { component: "textarea" } },
    {
      type: "string",
      label: "Layout",
      name: "layout",
      options: [
        { label: "Home flight cards", value: "flight" },
        { label: "Menu dusk list", value: "dusk" }
      ]
    },
    {
      type: "object",
      label: "Courses",
      name: "courses",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.name ? `${item?.n ?? ""} \u2014 ${item.name}` : "Course"
        })
      },
      fields: [
        { name: "n", label: "Roman numeral", type: "string" },
        { name: "numeral", label: "Number", type: "string" },
        { name: "time", label: "Time", type: "string" },
        { name: "name", label: "Name", type: "string" },
        { name: "sense", label: "Sense line", type: "string" },
        { name: "line", label: "Description", type: "string", ui: { component: "textarea" } },
        { name: "img", label: "Image", type: "image" },
        { name: "imgB", label: "Image B (choice)", type: "image", required: false },
        { name: "accent", label: "Accent color", type: "string" },
        { name: "choice", label: "Choices", type: "string", list: true, required: false }
      ]
    }
  ],
  ui: {
    defaultItem: {
      eyebrow: "The menu \u2014 dinner in five courses",
      headline: "Five plates land. Scroll to serve.",
      description: "A tasting menu means the kitchen decides the order \u2014 small plates, eaten in sequence.",
      layout: "flight"
    }
  }
};

// src/components/blocks/assembly.template.ts
var assemblyBlockSchema = {
  name: "assembly",
  label: "Fire assembly",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Caption", name: "caption" },
    { type: "string", label: "Badge", name: "badge" },
    { name: "image", label: "Backdrop image", type: "image" },
    { name: "plateSrc", label: "Plate image", type: "image" },
    {
      type: "object",
      label: "Steps",
      name: "steps",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title ? `${item?.n ?? ""} \u2014 ${item.title}` : "Step"
        })
      },
      fields: [
        { type: "string", label: "Numeral", name: "n" },
        { type: "string", label: "Title", name: "title" },
        { type: "string", label: "Text", name: "text", ui: { component: "textarea" } }
      ]
    }
  ],
  ui: {
    defaultItem: {
      eyebrow: "The fire",
      caption: "Scroll \u2014 the plate assembles",
      badge: "Course VII"
    }
  }
};

// src/components/blocks/storyPreview.template.ts
var storyPreviewBlockSchema = {
  name: "storyPreview",
  label: "Story preview",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline", ui: { component: "textarea" } },
    { type: "string", label: "Body 1", name: "body1", ui: { component: "textarea" } },
    { type: "string", label: "Body 2", name: "body2", ui: { component: "textarea" } },
    { type: "string", label: "Est. label", name: "estLabel" },
    { type: "string", label: "CTA label", name: "ctaLabel" },
    { type: "string", label: "CTA link", name: "ctaLink" },
    { name: "image", label: "Portrait image", type: "image" },
    { type: "string", label: "Nameplate", name: "nameplate" },
    { type: "string", label: "Quote", name: "quote", ui: { component: "textarea" } }
  ],
  ui: {
    defaultItem: {
      eyebrow: "The chef",
      headline: "One room, one kiln, fourteen seats.",
      estLabel: "est. 2019",
      ctaLabel: "Read her letter \u2192",
      ctaLink: "/story/",
      nameplate: "Mara Okafor \u2014 Chef & Founder",
      quote: "\u201CThe kiln decides. I just translate.\u201D"
    }
  }
};

// src/components/blocks/menuHeader.template.ts
var menuHeaderBlockSchema = {
  name: "menuHeader",
  label: "Menu header",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline line 1", name: "headline1" },
    { type: "string", label: "Headline line 2", name: "headline2" },
    { type: "string", label: "Description", name: "description", ui: { component: "textarea" } },
    { name: "background", label: "Background image", type: "image" }
  ],
  ui: {
    defaultItem: {
      eyebrow: "The menu \u2014 one evening, twelve courses",
      headline1: "Eat in order.",
      headline2: "Choose twice.",
      description: "Twelve courses, \xA3185. Wine pairing \xA395, juice pairing \xA355. The whole table takes the tasting. Scroll \u2014 the light dies as dinner progresses."
    }
  }
};

// src/components/blocks/letter.template.ts
var letterBlockSchema = {
  name: "letter",
  label: "Kitchen letter",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline" },
    { type: "string", label: "Margin note", name: "marginNote" },
    { type: "string", label: "Paragraph 1", name: "para1", ui: { component: "textarea" } },
    { type: "string", label: "Paragraph 2", name: "para2", ui: { component: "textarea" } },
    { type: "string", label: "Signoff", name: "signoff" }
  ]
};

// src/components/blocks/facts.template.ts
var factsBlockSchema = {
  name: "facts",
  label: "Room facts",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    {
      type: "object",
      label: "Facts",
      name: "facts",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.n && item?.t ? `${item.n} \u2014 ${item.t}` : "Fact"
        })
      },
      fields: [
        { type: "string", label: "Number", name: "n" },
        { type: "string", label: "Text", name: "t" }
      ]
    }
  ]
};

// src/components/blocks/suppliers.template.ts
var suppliersBlockSchema = {
  name: "suppliers",
  label: "Suppliers strip",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline" },
    { type: "string", label: "Hint", name: "hint" },
    {
      type: "object",
      label: "Suppliers",
      name: "suppliers",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name ?? "Supplier" })
      },
      fields: [
        { type: "string", label: "Name", name: "name" },
        { type: "string", label: "Description", name: "desc" },
        { name: "img", label: "Image", type: "image" }
      ]
    }
  ]
};

// src/components/blocks/cta.template.ts
var ctaBlockSchema = {
  name: "cta",
  label: "Closing CTA",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline", ui: { component: "textarea" } },
    { type: "string", label: "Primary label", name: "primaryLabel" },
    { type: "string", label: "Primary link", name: "primaryLink" },
    { type: "string", label: "Secondary label", name: "secondaryLabel" },
    { type: "string", label: "Secondary link", name: "secondaryLink" }
  ],
  ui: {
    defaultItem: {
      eyebrow: "If that sounds like dinner to you",
      headline: "Two seatings nightly. Fourteen seats.",
      primaryLabel: "Request a table \u2192",
      primaryLink: "/visit/",
      secondaryLabel: "Read the menu first",
      secondaryLink: "/menu/"
    }
  }
};

// src/components/blocks/visitIntro.template.ts
var visitIntroBlockSchema = {
  name: "visitIntro",
  label: "Visit intro",
  fields: [
    { type: "string", label: "Eyebrow", name: "eyebrow" },
    { type: "string", label: "Headline", name: "headline" },
    { type: "string", label: "Description", name: "description", ui: { component: "textarea" } },
    { type: "string", label: "Note 1", name: "note1" },
    { type: "string", label: "Note 2", name: "note2" },
    { type: "string", label: "Note 3", name: "note3" }
  ],
  ui: {
    defaultItem: {
      eyebrow: "Reservations",
      headline: "Request a table.",
      description: "Tell us when and how many. We telephone within a day to confirm \u2014 every request is answered by voice.",
      note1: "Parties above six \u2014 telephone only: +1 503 555 0184.",
      note2: "Mon \u2013 Wed the kiln rests. We telephone \u2014 never text, never spam.",
      note3: "14 Kiln Lane, Portland OR \u2014 look for the brass flame by the door."
    }
  }
};

// tina/collections/page.ts
var PageCollection = {
  name: "page",
  label: "Pages",
  path: "src/content/page",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") return "/";
      return `/${document._sys.filename}`;
    }
  },
  fields: [
    {
      name: "seoTitle",
      label: "Meta title (SEO)",
      type: "string",
      isTitle: true,
      required: true
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Page sections",
      ui: { visualSelector: true },
      templates: [
        heroBlockSchema,
        marqueeBlockSchema,
        coursesBlockSchema,
        assemblyBlockSchema,
        storyPreviewBlockSchema,
        menuHeaderBlockSchema,
        letterBlockSchema,
        factsBlockSchema,
        suppliersBlockSchema,
        ctaBlockSchema,
        visitIntroBlockSchema
      ]
    }
  ]
};

// tina/collections/journal.ts
var JournalCollection = {
  name: "journal",
  label: "Journal Entries",
  path: "src/content/journal",
  format: "markdown",
  ui: {
    router: ({ document }) => `/journal/${document._sys.filename}`
  },
  fields: [
    { name: "title", label: "Title", type: "string", isTitle: true, required: true },
    { name: "date", label: "Date", type: "datetime" },
    { name: "category", label: "Category", type: "string" },
    { name: "description", label: "Description", type: "string", ui: { component: "textarea" } },
    { name: "image", label: "Image", type: "image" },
    { name: "body", label: "Body", type: "rich-text", isBody: true }
  ]
};

// tina/collections/global.ts
var GlobalCollection = {
  name: "config",
  label: "Global config",
  path: "src/content/config",
  format: "json",
  ui: { global: true },
  fields: [
    {
      name: "seo",
      label: "Site identity & SEO",
      type: "object",
      fields: [
        { name: "title", label: "Site name", type: "string", required: true },
        { name: "description", label: "Default meta description", type: "string", required: true }
      ]
    },
    {
      name: "nav",
      label: "Navigation menu",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title ?? "Link" })
      },
      fields: [
        { name: "title", label: "Title", type: "string", required: true },
        { name: "link", label: "Link", type: "string", required: true }
      ]
    },
    {
      name: "footer",
      label: "Footer",
      type: "object",
      fields: [
        { name: "ctaEyebrow", label: "CTA eyebrow", type: "string" },
        { name: "ctaHeadline", label: "CTA headline", type: "string" },
        { name: "ctaText", label: "CTA text", type: "string", ui: { component: "textarea" } },
        { name: "phone", label: "Phone", type: "string" },
        { name: "email", label: "Email", type: "string" },
        { name: "address1", label: "Address line 1", type: "string" },
        { name: "address2", label: "Address line 2", type: "string" }
      ]
    }
  ]
};

// tina/config.ts
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: ""
    }
  },
  schema: {
    collections: [PageCollection, JournalCollection, GlobalCollection]
  }
});
export {
  config_default as default
};
