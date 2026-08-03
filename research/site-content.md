# Legacy Site Content - ispmd.org

Everything extracted from the existing Squarespace site, plus facts gathered from third-party sources.
Captured 2026-08-03.

**Rule for implementers:** anything marked UNVERIFIED must not appear on a page as an assertion until the school confirms it.

---

## Organization facts

| Fact | Value | Source |
|---|---|---|
| Name | Islamic School of Potomac (ISP) | site |
| Legal status | 501(c)(3) non-profit | `/donate` |
| EIN | 52-1989063 | `/donate` |
| Mailing address | Islamic School of Potomac, P.O. Box 833, Rockville, Maryland 20848-0833 | `/donate` |
| Email | info@ispmd.org | site footer |
| Instagram | [@ispmd](https://www.instagram.com/ispmd/) - 147 followers, 63 posts, last post May 2023 | verified |
| Facebook | facebook.com/Islamic-School-of-Potomac-100899361744812 | site |
| Enrollment form | JotForm `261994492004057` | site nav |
| Donation | PayPal hosted button `24GHPP5NMDF74` | `/donate` |
| Squarespace site id | `5f24b7d1da8fe325a80a9724` | CDN URLs |

### UNVERIFIED - third-party sources only, never stated on ispmd.org

| Fact | Value | Source |
|---|---|---|
| Class location | Islamic Education Center, 7917 Montrose Rd, Potomac MD 20854 | Yelp / IEC site |
| Class times | Sundays, 10:00 AM until Salat al-Dhuhr | iec-md.com |
| School year | September through May | iec-md.com |
| Phone | (301) 340-2070 | appears to be the IEC main line, not ISP's |
| Age range | 5 through 18 | iec-md.com (kindergarten minimum IS confirmed on `/faqs`) |

---

## Copy, verbatim

### Homepage

> Welcome to the Islamic School of Potomac

> We are more than a Sunday School.

> We are a community.

> The Islamic School of Potomac was founded with a commitment to uplift every member of the family, not just the students registered in our school.

> when the spiritual needs of each member of the family are nourished, everyone thrives

Mission, as stated on `/home`:

1. To provide Muslim children a foundational Islamic education with emphasis on the Quran and essentials of Islamic religion.
2. To promote an environment that reinforces Muslim identity.

Other homepage fragments:

> Some of the students at ISP share why they love the Islamic School of Potomac.

> Follow our journey on social media.

The Instagram bio matches the site tagline exactly: "We are more than a Sunday school. We are a community."

### Program page (`/program`)

Epigraph:

> "…and say, 'My Lord, increase me in knowledge.'" - 20:114

Three sections: **Arabic**, **Deen**, and **"...and in between"**.

**Arabic.** The school aims to help students read Arabic in order to promote their relationship with the Quran.
Uses the **Noorani method** for recitation instruction, teaches basic Quranic vocabulary, facilitates memorization of shorter suras, and cultivates "a love for the Quran as a book of guidance."

**Deen.** Thematic teaching across grade levels in age-appropriate ways. The Spring 2021 theme was "Know Our Self."

**Teaching philosophy** - this is the school's single most distinctive line:

> Children have enough homework during the week. We don't give homework to children - we give it to the parents!

Parents reinforce learning through family participation in prayers, charity, and community service.

### FAQs page (`/faqs`)

> Arabic class placement is determined by placement test. Deen class placement is determined by the age of the student.

> The cost is $60 for one student and $100 for a family. Financial assistance is available.

> Our classes begin at kindergarten, with 5 year-olds.

> Parent feedback and volunteering is encouraged.

### Donate page (`/donate`)

> ISP is a 501(c)(3) non-profit organization, and donations are tax-deductible

Two mechanisms: PayPal (one-time and recurring, credit card or PayPal balance) and check by mail to the P.O. Box.

---

## Legacy site structure

Real pages: `/home` · `/program` · `/calendar` · `/faqs` · `/donate` · `/donation-thank-you`

Plus roughly 150 auto-generated Squarespace event permalinks under `/calendar-2425/*`, nearly all junk slugs like
`/calendar-2425/event-three-3s5cr-d6atn-n4bay-yeknc-adfcg-5tzs7-...`.
On eventual cutover these should all 301 to `/calendar`.

---

## Image inventory

The legacy site has **three content images plus a logo**. Effectively nothing is salvageable.

| File | Assessment |
|---|---|
| `ISP_logo_BLK_Full.png` | The logo. Worth keeping as a reference for the wordmark; needs redrawing as SVG. |
| `reza-payandeh-MEA6VvqOBvw-unsplash.jpg` | The homepage hero is **itself a stock Unsplash photo**. Discard. |
| `IMG_2934.jpg` | Unassessed, low resolution. |
| `image-asset.jpeg` | Unassessed, low resolution. |

The `/program` page additionally references a banner of books, a photo of hands, and a photo of a person reading.
All appear to be stock.

**Conclusion:** the new site cannot be built on legacy photography. See the media slot registry in the tech plan.

---

## Instagram as a photo source

@ispmd holds 63 posts of real ISP students and classrooms from 2022-2023.
Media is **not** programmatically accessible - Instagram serves the profile shell and loads all media through authenticated GraphQL. No post URLs or CDN links exist in the page source.

Path to obtaining them: Instagram's "Download Your Information" export (Settings → Accounts Center → Your information and permissions) returns original-quality uploads rather than compressed thumbnails.
Amin to supply. When the export lands, catalog usable frames into `src/data/media.ts`.

Caveats: photos are 2022-23, and Instagram compression makes them viable for editorial body slots but not for full-bleed use.

---

## Design references named by Amin

| Site | What to take |
|---|---|
| [gsmd.ac.uk](https://www.gsmd.ac.uk/) | Typographic confidence, compositional nerve |
| [risd.edu](https://www.risd.edu/) | Editorial rhythm, willingness to be unconventional |
| [imperial.ac.uk](https://www.imperial.ac.uk/) | Structural clarity, information density done cleanly |
| [soas.ac.uk](https://www.soas.ac.uk/) | Intellectual seriousness; a non-Western institution presenting itself with gravity |
| [umich.edu](https://umich.edu/) | Multi-audience routing from one homepage |
| [umd.edu](https://umd.edu/) | The video montage hero format, explicitly requested |

## Prior builds to match for repo pattern

- `~/Documents/GitHub/standard-dental` - Astro 7 + GSAP + Lenis + Three.js, Cloudflare Pages
- `~/Documents/GitHub/GreenPlateCatering` - same stack, GitHub Actions deploy
