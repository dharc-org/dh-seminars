// Past editions for the "Previous Editions" nav dropdown.
//
// Each edition is published in its own folder, so a past edition's URL is simply
// its in-repo slug URL: https://<org>.github.io/<repo>/<slug>/
// Add one entry here when you launch a new edition (pointing at the edition you
// are replacing), newest-first. The site root always redirects to the current
// edition, so you never link to the bare root here.
//
// The 2025 edition is a SPECIAL hardcoded case: it lives in a separate repo and
// is already published at its own GitHub Pages URL, so we link to it directly.
//
// If this array is empty, the dropdown is hidden entirely.
export const pastEditions = [
  {
    name: "Building Knowledge Landscapes Across the Digital Humanities",
    slug: "dharc-x-dhlab-seminars",
    year: 2025,
    url: "https://dharc-org.github.io/dharc-x-dhlab-seminars/",
  },
];
