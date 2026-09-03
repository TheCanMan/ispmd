# Islamic School of Potomac - Copy Deck

Every word of user-facing text on the site.
**Use it verbatim.** Implementers do not write, edit, expand or shorten prose. If something is missing, it is a gap in this file and should be raised, not filled.

Design and layout are in `DESIGN.md`. This file says what the words are; that file says where they go.

## Voice

The school's own writing is better than its website, and three of its lines carry the whole institution.
They appear here unchanged:

> We are more than a Sunday School. We are a community.

> The Islamic School of Potomac was founded with a commitment to uplift every member of the family, not just the students registered in our school.

> Children have enough homework during the week. We don't give homework to children - we give it to the parents!

Everything else is written to sit beside those without embarrassing them.

- Plain sentences. Short ones. No copywriter cadence, no "nurturing young minds", no "journey".
- Concrete over aspirational. `Thirty-three Sundays` beats `a full year of enriching experiences`.
- Never oversell. This is a small school with $60 tuition and it is more persuasive when it says so.
- One exclamation mark exists on this site, in the teaching-philosophy line. It is theirs. Do not add another.
- American spelling throughout (`enroll`, `enrollment`, `color`).
- No em dashes. Plain hyphens or a full stop.

## Facts this copy is allowed to state

Tuition $60 per student and $100 per family, financial assistance available · kindergarten minimum at age 5 · ages 5 through 18 · Arabic placement by test, Deen placement by age · classes held at the Islamic Education Center, 7917 Montrose Rd, Potomac, MD 20854 · Sundays, 10:00 AM until Salat al-Dhuhr · September through May · 501(c)(3) with EIN 52-1989063 · mailing address P.O. Box 833, Rockville, MD 20848-0833 · **phone (301) 929-1441** · info@ispmd.org · the full 2026-2027 calendar.

## Facts this copy must never state

| Not stated | Why |
|---|---|
| **The Islamic Education Center's number, (301) 340-2070** | It belongs to a legally separate organization with its own EIN (52-1485374). Publishing it as the school's number routes parents to a different organization. ISP's own line, **(301) 929-1441**, is the only telephone number that appears anywhere on this site, including the schema block. |
| **Any street address for ISP** | ISP has none. Third-party directories tie ISP's phone number to a residential address in Rockville; the *number* was cleared for publication and the *address* was not. It is off-limits in every form, including structured data and OG tags. The P.O. Box is mail and donations only. Classes are *held at* the IEC, and that address is the venue, never "our address." |
| **Staff, teacher or board names** | None published. |
| **Founding year, student count, alumni count, years of operation** | Unknown. Do not estimate. |
| **A class-by-class schedule** | Only the 10:00 AM start and the Salat al-Dhuhr close are confirmed. |
| **Anything denominational or commemorative** | Settled positioning: broadly Muslim, no sectarian markers. |

**The venue framing rule (revised 2026-08-03 after client call).** State the venue plainly and stop: "Classes are held at the Islamic Education Center, 7917 Montrose Rd, Potomac, MD 20854." Do not add commentary differentiating ISP from the IEC - no "separate organization," no "the building is not ours," no "meets there but does not own it." The school asked for that language to be removed. The one constraint that survives is factual: copy still must not claim the address as ISP's own ("our address," "our building," "visit us at"). Say where class is held; say nothing about ownership either way.

## Marked for confirmation before launch

None of these block the build. All are single-line edits.

1. **Three sentences make a claim the school has not published.** They are listed in full in the implementer notes at the end of this file, and each one is flagged inline where it appears. Confirm them or cut them; every surrounding paragraph works without them.
2. **A history section on Our Story.** The page carries an explicit insertion point (`[HISTORY]`) for a founding year and origin story. It is written to be complete without one - do not invent filler for it.
3. **"Volunteer-run" is deliberately absent.** The epic brief describes the school that way, but the school has not published the phrase, so this deck describes what volunteers actually do instead. That is truer, more persuasive, and needs no retraction if the framing turns out to be imprecise.

## One correction to the research

`research/calendar-2026-2027.md` totals "24 class sessions". The correct figure is **25**: 33 Sundays, 8 no-school, 20 ordinary class days and 5 milestone days that also hold class. The copy below uses 25. Do not change it back.

---

# Global

## Navigation

| Element | Text |
|---|---|
| Wordmark, line 1 | `Islamic School` |
| Wordmark, line 2 | `of Potomac` |
| Nav link 1 | `Our Story` |
| Nav link 2 | `Program` |
| Nav link 3 | `Calendar` |
| Nav link 4 | `FAQs` |
| Nav link 5 | `Give` |
| Nav CTA | `Enroll` |
| Mobile menu trigger | `Menu` |
| Mobile menu close | `Close` |
| Mobile menu extra links | `Enroll` · `Contact` |
| Mobile menu contact row | `(301) 929-1441` · `info@ispmd.org` |
| Skip link | `Skip to main content` |

## Footer

**Column 1**

```
Islamic School
of Potomac

(301) 929-1441
info@ispmd.org

MAIL ONLY
Islamic School of Potomac
P.O. Box 833
Rockville, MD 20848-0833
```

**Column 2** (two link stacks)

```
Our Story        Enroll
Program          Give
Calendar         Contact
FAQs
```

**Column 3**

```
Islamic School of Potomac is a 501(c)(3)
non-profit organization. Donations are
tax-deductible.

EIN 52-1989063
```

Button: `Support the school`
Social links: `Instagram` · `Facebook`

**Bottom band**

```
وَقُلْ رَبِّ زِدْنِي عِلْمًا

"…and say, 'My Lord, increase me in knowledge.'"

20:114
```

The Arabic is copied verbatim and never retyped. It carries `lang="ar" dir="rtl"`. The English sits in italic beneath it; the reference is a mono label.

## Recurring buttons and links

Use these exact labels wherever the element recurs. Shorten only if space genuinely forces it, and shorten rather than rewrite.

| Purpose | Label |
|---|---|
| Primary enrollment CTA | `Enroll your child` |
| Secondary enrollment CTA | `Start enrollment` |
| To the program page | `See the program` |
| To the calendar | `See the full year` |
| Download the calendar file | `Add the year to your calendar` |
| To the give page | `Support the school` |
| PayPal | `Give through PayPal` |
| To contact | `Get in touch` |
| Phone link label | `(301) 929-1441` - `href="tel:+13019291441"` |
| Email link label | `info@ispmd.org` |
| Direct JotForm link | `Open the enrollment form in a new tab` |
| Back home from 404 | `Go to the homepage` |

## Page titles and meta descriptions

| Page | `<title>` | Meta description |
|---|---|---|
| Home | `Islamic School of Potomac` | `A Sunday school in Potomac, Maryland for children ages 5 to 18. Arabic, Deen, and everything in between, September through May.` |
| Our Story | `Our Story - Islamic School of Potomac` | `We were founded to uplift every member of the family, not only the students registered in our school. This is what that means on a Sunday morning.` |
| Program | `Program - Islamic School of Potomac` | `Arabic, Deen, and "...and in between." How the Islamic School of Potomac teaches children ages 5 to 18, one morning a week.` |
| Calendar | `Calendar 2026-2027 - Islamic School of Potomac` | `Thirty-three Sundays, twenty-five of them class. The full 2026-2027 academic calendar, including the Deen Showcase, Arabic Final Exams and the Quran Competition.` |
| Enroll | `Enroll - Islamic School of Potomac` | `Tuition is $60 for one student and $100 for a family, and financial assistance is available. Here is how to enroll for 2026-2027.` |
| FAQs | `FAQs - Islamic School of Potomac` | `Ages, tuition, placement, what a Sunday looks like, and how to get involved. The questions families ask us most.` |
| Give | `Give - Islamic School of Potomac` | `Tuition is $60 a student. It does not cover a year. The Islamic School of Potomac is a 501(c)(3) non-profit, EIN 52-1989063.` |
| Contact | `Contact - Islamic School of Potomac` | `Call (301) 929-1441, write to info@ispmd.org, or come and find us on a Sunday morning. Classes are held at the Islamic Education Center in Potomac, Maryland.` |
| 404 | `Page not found - Islamic School of Potomac` | `That page is not here.` |

Open Graph title and description mirror the above. OG image: the generated girih field poster, `og-default.jpg`, 1200 x 630.

---

# Home - `/`

## 1. The Field (hero)

**Eyebrow** (`.t-label`)

```
POTOMAC, MARYLAND · SUNDAY MORNINGS
```

**Headline** (`.t-hero`, three lines, line breaks are deliberate)

```
We are more than
a Sunday school.
We are a community.
```

**Lead** (`.t-lead`)

```
A school for children ages 5 to 18, one morning a week, built by the families who send their children to it.
```

**Buttons:** `Enroll your child` · `See the program`

**Scroll cue** (`.t-label`): `SCROLL`

## 2. The Three Doors

Section is unlabeled. The three rows are the content.

| Index | Title (`.t-title`) | Line beneath (`.t-small`) | Goes to |
|---|---|---|---|
| `01` | `Thinking about enrolling` | `What a Sunday looks like, what it costs, and how to start.` | `/enroll` |
| `02` | `Already with us` | `The calendar, the year's three big days, and when we next meet.` | `/calendar` |
| `03` | `Standing behind the school` | `Where the money goes at a school with $60 tuition.` | `/give` |

## 3. More than a Sunday School

**Label:** `WHY WE EXIST`

**Display headline** (`.t-display`)

```
Every member
of the family.
```

**Lead** (`.t-lead`)

```
The Islamic School of Potomac was founded with a commitment to uplift every member of the family, not just the students registered in our school. When the spiritual needs of each member of the family are nourished, everyone thrives.
```

**Epigraph block**

```
وَقُلْ رَبِّ زِدْنِي عِلْمًا
```

```
"…and say, 'My Lord, increase me in knowledge.'"
```

```
20:114
```

## 4. The Homework

**Label:** `OUR TEACHING PHILOSOPHY`

**Setup** (`.t-subtitle`, `--text-on-dark-soft`)

```
Children have enough homework during the week.
```

**Punchline** (`.t-hero`, four lines, line breaks are deliberate. The exclamation mark is its own `<span>` in `--amber`.)

```
We don't give
homework to children.
We give it to
the parents!
```

**Below** (`.t-body`, `--text-on-dark-soft`, spans `2 / 7`)

```
Parents reinforce what their children learn by doing it with them: praying together, giving together, showing up for the community together. It is the part of the program that happens at your kitchen table, and it is the reason a Sunday morning here works.
```

**Button:** `See the program`

## 5. The Program in brief

**Label:** `WHAT WE TEACH`

| Index | Title | Body |
|---|---|---|
| `01` | `Arabic` | `We teach children to read Arabic so that they can meet the Quran themselves. Recitation through the Noorani method, basic Quranic vocabulary, the shorter suras committed to memory, and a love for the Quran as a book of guidance.` |
| `02` | `Deen` | `Taught by theme rather than by textbook. A six-year-old and a sixteen-year-old spend the same Sunday on the same idea, each at the depth their age can hold.` |
| `03` | `...and in between` | `The school's own name for the part that is on no syllabus. The friendships. The question asked in a hallway. The habit of showing up on a Sunday when you could be anywhere else.` |

**Button:** `See the program`

## 6. This year

**Label:** `2026 - 2027`

**Display headline** (`.t-display`)

```
Thirty-three Sundays.
```

**Body** (`.t-body`)

```
The school meets on twenty-five of them. Eight Sundays are off, for holidays and for the Nights of Power. Three of the twenty-five the whole school looks forward to.
```

**The three milestone cards**

| Date | Title | Line |
|---|---|---|
| `DECEMBER 13, 2026` | `Deen Showcase` | `The end of the first semester, and what the children have been working toward since September.` |
| `MAY 9, 2027` | `Arabic Final Exams` | `A year of reading, in one morning.` |
| `MAY 16, 2027` | `Quran Competition` | `The last day of school.` |

**Buttons:** `See the full year` · `Add the year to your calendar`

**Scroll affordance on the 33-cell band** (`.t-label`): `SCROLL THE YEAR`

## 7. Standing behind the school

**Label:** `SUPPORT`

**Display headline** (`.t-display`)

```
Tuition is $60.
That is not what
a year costs.
```

**Body** (`.t-body`)

```
The difference is made up by people who believe a community should have a school in it. The Islamic School of Potomac is a 501(c)(3) non-profit, and every dollar goes into the Sunday morning: the books, the room, the year.
```

**Button:** `Support the school`

---

# Our Story - `/our-story`

## 1. Masthead

**Label:** `ABOUT THE SCHOOL`

**Headline** (`.t-hero`)

```
More than
a Sunday school.
```

## 2. The founding commitment

**Lead** (`.t-lead`)

```
Most Sunday schools are built around a student. This one was built around a family.
```

**Column 1** (`.t-body`)

```
The Islamic School of Potomac teaches children ages 5 through 18, September through May. Arabic, Deen, and a third part of the program the school has never quite been able to name, so it calls it "...and in between."
```

**Column 2** (`.t-body`)

```
What holds those three together is not a curriculum. It is the understanding that a child does not learn a way of living for two hours on a Sunday and then set it down. What the school teaches has to be carried home, and the person who carries it is a parent.
```

**Pull quote** (`.t-title`, Literata italic, spans `2 / 10`)

```
The Islamic School of Potomac was founded with a commitment to uplift every member of the family, not just the students registered in our school.
```

`[HISTORY]` - insertion point. When the school supplies a founding year and an origin story, a two-paragraph block goes here, between the pull quote and section 3. The page is complete without it.

## 3. A community, not a school

**Label:** `WHO IS HERE`

**Headline** (`.t-display`)

```
We are a community.
```

**Body** (`.t-body`)

```
The families who send their children here are the same people who set out the chairs, teach the classes, run the Showcase and answer the email. That is not a shortage of staff dressed up as a virtue. It is how a school this size stays honest: nobody here is being paid to tell you it is going well.
```

```
It also means the school is exactly as good as the people who show up for it, which is the most persuasive thing we can say about it.
```

## 4. What a Sunday is

No section label - the first row's own marker already reads `THE MORNING`, and having both said it twice in a row.

**Headline** (`.t-display`)

```
One morning a week,
for thirty-three weeks.
```

| Marker | Line (`.t-subtitle`) | Body (`.t-body`) |
|---|---|---|
| `THE MORNING` | `Arabic and Deen.` | `Arabic classes are grouped by a placement test, so a child sits with others reading at the same level. Deen classes are grouped by age, so a child sits with others asking the same questions.` |
| `SALAT AL-DHUHR` | `The morning ends.` | `Class runs until the midday prayer. Then everyone goes home to the rest of their Sunday, with something to do together during the week.` |

## 5. Volunteers

**Label:** `HOW IT RUNS`

**Headline** (`.t-display`)

```
Parent feedback and
volunteering is
encouraged.
```

**Body** (`.t-body`)

```
If you have an hour, a skill, or a strong opinion about how something should be run, the school would rather hear it than not.
```

**Button:** `Get in touch`

## 6. CTA

**Headline** (`.t-display`)

```
Come and see
a Sunday.
```

**Body** (`.t-body`)

```
Enrollment for 2026-2027 is open. Tuition is $60 for one student and $100 for a family, and financial assistance is available to anyone who needs it.
```

**Buttons:** `Enroll your child` · `See the program`

---

# Program - `/program`

## 1. Masthead

**Label:** `WHAT WE TEACH`

**Headline** (`.t-hero`)

```
Arabic, Deen,
and in between.
```

**Epigraph block** (spans `6 / 11`, right-aligned)

```
وَقُلْ رَبِّ زِدْنِي عِلْمًا
```

```
"…and say, 'My Lord, increase me in knowledge.'"
```

```
20:114
```

## 2. How the program is built

**Lead** (`.t-lead`)

```
The program has three parts. Two of them have names the school chose carefully.
```

## 3. Arabic

**Index:** `01`
**Arabic mark** (`.t-arabic-kufi`, `--sienna`): `العربية`

**Headline** (`.t-display`)

```
Arabic
```

**Body** (`.t-body`)

```
The goal is not fluency in a modern spoken language. The goal is that a child can open the Quran and read it without an intermediary. Everything in this half of the program serves that.
```

```
Classes are grouped by a placement test rather than by age, so a nine-year-old who reads well and a thirteen-year-old who is starting out are each in the right room.
```

**Four-item list** (`.t-subtitle` rows)

```
Recitation, taught through the Noorani method
Basic Quranic vocabulary
The shorter suras, committed to memory
A love for the Quran as a book of guidance
```

## 4. Deen

**Index:** `02`
**Arabic mark** (`.t-arabic-kufi`, `--slate`): `الدين`

**Headline** (`.t-display`)

```
Deen
```

**Body** (`.t-body`)

```
Deen is taught thematically rather than by textbook. The school picks a theme and every grade takes it on in a way its age can hold, which means a family with three children of different ages is having one conversation at home instead of three.
```

```
Classes are grouped by age, because the questions a child asks about how to live change faster than their reading does.
```

## 5. ...and in between

**Index:** `03`

**Headline** (`.t-display`, set in Literata italic)

```
...and in between
```

**Body** (`.t-body`)

```
It is the friendship a child makes with someone they would never have met at their weekday school. It is the question asked in the hallway that the class was too shy for. It is a teenager who has been coming since kindergarten helping a five-year-old find the right room. It is the habit of showing up on a Sunday morning when you could be anywhere else.
```

```
It is also, in the school's experience, the part children remember longest.
```

## 6. Placement

**Label:** `HOW CHILDREN ARE PLACED`

| Title (`.t-subtitle`) | Body (`.t-body`) |
|---|---|
| `Arabic: by placement test` | `A short placement test on the first day of school, so a child sits with others reading at the same level. It is not an exam and nobody passes or fails it.` |
| `Deen: by age` | `Deen classes are grouped by the age of the student.` |

## 7. Homework, restated

**Label:** `OUR TEACHING PHILOSOPHY`

**Headline** (`.t-display`, four lines. The exclamation mark is its own `<span>` in `--amber`.)

```
Children have enough
homework during the week.
We don't give homework to
children. We give it to the parents!
```

**Body** (`.t-body`, `--text-on-dark-soft`)

```
What that means in practice: the school asks parents to reinforce what is taught by doing it, not by quizzing. Praying as a family. Giving as a family. Serving the community as a family.
```

```
A child who is told about charity learns a word. A child who watches a parent give learns a habit.
```

## 8. The year's three moments

**Label:** `WHAT THE YEAR BUILDS TOWARD`

| Date | Title | Body |
|---|---|---|
| `DECEMBER 13, 2026` | `Deen Showcase` | `The end of the first semester. The children present what they have been working on since September, to each other and to their families.` |
| `MAY 9, 2027` | `Arabic Final Exams` | `A year of reading, in one morning.` |
| `MAY 16, 2027` | `Quran Competition` | `The last day of school, and the one the whole year points at.` |

**Button:** `See the full year`

## 9. CTA

**Headline** (`.t-display`)

```
Thirty-three Sundays
start in September.
```

**Buttons:** `Enroll your child` · `See the full year`

---

# Calendar - `/calendar`

## 1. Masthead

**Label:** `ACADEMIC CALENDAR`

**Headline** (`.t-hero`)

```
2026 - 2027
```

**Sub-line** (`.t-lead`)

```
Thirty-three Sundays. The school meets on twenty-five of them.
```

## 2. Next class

**Label:** `NEXT CLASS`

Computed client-side against the visitor's clock. Three states, all three written here. No other state may be shown.

| State | Copy |
|---|---|
| A future session exists | Date in mono, then the session title, then `.t-body`: `That is {N} days from today.` (`{N} day` when N is 1; `That is today.` when N is 0.) |
| The next dated Sunday is a no-school day | Shows the *next class* date, and beneath it: `The Sunday before is off: {title}.` |
| The year has ended | Label becomes `THE YEAR HAS ENDED`. Headline: `The 2026-2027 year finished on May 16.` Body: `The calendar for the next school year goes up over the summer. Write to info@ispmd.org and we will tell you when.` |

**Button:** `Add the year to your calendar`

**Note beneath the button** (`.t-small`)

```
Downloads a calendar file with all thirty-three Sundays in it. Open it once and every date lands in the calendar you already use.
```

## 3. The year (33-cell band)

**Legend** (`.t-label` swatches, in this order)

```
CLASS    NO SCHOOL    MILESTONE    RAMADAN
```

**Scroll affordance** (`.t-label`, homepage version only): `SCROLL THE YEAR`

## 4. Semester 1

**Heading** (`.t-title`, 3px `--sienna` top rule)

```
First Semester
```

**Sub-line** (`.t-small`)

```
September 13 to December 13. Fourteen Sundays, eleven of them class.
```

Rows, in order. `Date` column is mono. The `Kind` column is the right-aligned label.

| Date | Title | Kind |
|---|---|---|
| September 13, 2026 | Back to School Day | Milestone |
| September 20, 2026 | Class | Class |
| September 27, 2026 | No School | No school |
| October 4, 2026 | Class | Class |
| October 11, 2026 | No School | No school |
| October 18, 2026 | Class | Class |
| October 25, 2026 | Class | Class |
| November 1, 2026 | Class | Class |
| November 8, 2026 | Class | Class |
| November 15, 2026 | Class | Class |
| November 22, 2026 | Class | Class |
| November 29, 2026 | Thanksgiving Weekend | No school |
| December 6, 2026 | Class | Class |
| December 13, 2026 | Deen Showcase | Milestone |

The December 13 row carries the note `End of Semester 1`.

## 5. Semester 2

**Heading** (`.t-title`, 3px `--slate` top rule)

```
Second Semester
```

**Sub-line** (`.t-small`)

```
January 10 to May 16. Nineteen Sundays, fourteen of them class.
```

| Date | Title | Kind |
|---|---|---|
| January 10, 2027 | Semester 2 Begins | Milestone |
| January 17, 2027 | MLK Weekend | No school |
| January 24, 2027 | Class | Class |
| January 31, 2027 | Class | Class |
| February 7, 2027 | Class | Class |
| February 14, 2027 | Presidents' Day Weekend | No school |
| February 21, 2027 | Class | Class |
| February 28, 2027 | Class | Class |
| March 7, 2027 | Nights of Power | No school |
| March 14, 2027 | Class | Class |
| March 21, 2027 | Class | Class |
| March 28, 2027 | Spring Break | No school |
| April 4, 2027 | Spring Break | No school |
| April 11, 2027 | Class | Class |
| April 18, 2027 | Class | Class |
| April 25, 2027 | Class | Class |
| May 2, 2027 | Class | Class |
| May 9, 2027 | Arabic Final Exams | Milestone |
| May 16, 2027 | Quran Competition | Milestone |

February 21 and February 28 carry the annotation `RAMADAN`.
The May 16 row carries the note `Last day of school`.

## 6. The three moments

**Label:** `THREE DAYS THE YEAR POINTS AT`

| Date | Title | Body |
|---|---|---|
| `DECEMBER 13, 2026` | `Deen Showcase` | `The children present what they have been working on since September. It closes the first semester, and it is the best morning to come if you want to see what the school actually is.` |
| `MAY 9, 2027` | `Arabic Final Exams` | `A year of reading, in one morning. Nobody is ranked and nobody is held back.` |
| `MAY 16, 2027` | `Quran Competition` | `The last day of school. The whole year points at it.` |

## 7. Where and when

**Label:** `PRACTICAL`

**Headline** (`.t-title`)

```
Sunday mornings,
September through May.
```

**Body** (`.t-body`)

```
Class begins at 10:00 AM and runs until Salat al-Dhuhr. Classes are held at the Islamic Education Center, 7917 Montrose Rd, Potomac, MD 20854.
```

**Second paragraph** (`.t-body`)

```
If you need to check whether class is on, call (301) 929-1441 or write to info@ispmd.org.
```

**Button:** `Get in touch`

## 8. CTA

**Headline** (`.t-display`)

```
Not enrolled yet?
```

**Button:** `Enroll your child`

## Print header (print stylesheet only)

```
Islamic School of Potomac · Academic Calendar 2026-2027 · ispmd.org
```

---

# Enroll - `/enroll`

## 1. Masthead

**Label:** `ENROLLMENT 2026 - 2027`

**Headline** (`.t-hero`)

```
Enroll your child.
```

## 2. What you are enrolling in

**Lead** (`.t-lead`)

```
One morning a week, from September through May. Arabic, Deen, and everything in between, for children ages 5 through 18. Class begins at 10:00 AM and runs until Salat al-Dhuhr, at the Islamic Education Center on Montrose Road in Potomac.
```

## 3. Tuition

**Label:** `TUITION`

| Figure | Label beneath |
|---|---|
| `$60` | `one student` |
| `$100` | `a family` |

**Financial assistance card** (`.t-body`)

```
Financial assistance is available.
```

```
It is not a special case and it is not a favor. If tuition is a difficulty for your family, say so when you enroll and it will be handled quietly. No child has ever been turned away from this school over $60.
```

> **Confirm before launch.** The final sentence above ("No child has ever been turned away...") is a strong claim the school has not published. Confirm it with the school or delete that sentence; the paragraph works without it.

## 4. Who it's for

**Label:** `WHO IT'S FOR`

| Title (`.t-subtitle`) | Body (`.t-body`) |
|---|---|
| `Ages 5 through 18` | `Classes begin at kindergarten, with 5 year-olds, and run through high school.` |
| `Arabic placement is by test` | `A short placement test on the first day of school, so your child sits with others reading at the same level. Nobody passes or fails it.` |
| `Deen placement is by age` | `Deen classes are grouped by the age of the student.` |

## 5. Steps

**Label:** `HOW IT WORKS`

| Index | Title (`.t-subtitle`) | Body (`.t-body`) |
|---|---|---|
| `01` | `Fill in the form` | `It takes a few minutes. Your child, your family, and how to reach you.` |
| `02` | `The school writes back` | `You will hear from someone about Arabic placement and anything else that needs sorting before September.` |
| `03` | `Tuition` | `$60 for one student, $100 for a family. If that is a difficulty, say so in your reply.` |
| `04` | `The first Sunday` | `Back to School Day is September 13, 2026. Class begins at 10:00 AM.` |

## 6. The form

**Label:** `ENROLLMENT FORM`

**Fallback link beneath the embed, always visible**

```
Having trouble with the form? Open the enrollment form in a new tab.
```

Link label: `Open the enrollment form in a new tab`
Destination: the JotForm URL for form `261994492004057`.

## 7. Questions

**Headline** (`.t-title`)

```
Questions before you enroll?
```

**Body** (`.t-body`)

```
Most of them are already answered on the FAQs page. If yours isn't, call (301) 929-1441 or write to info@ispmd.org and a person will read it.
```

**Buttons:** `Read the FAQs` · `info@ispmd.org`

---

# FAQs - `/faqs`

## 1. Masthead

**Label:** `QUESTIONS`

**Headline** (`.t-hero`)

```
What families
ask us.
```

## 2. The list

Three groups. Question text is the accordion trigger; the answer is the panel. The first question in group one is open on load.

### Group label: `ENROLLING`

**How old does my child need to be?**

```
Our classes begin at kindergarten, with 5 year-olds. The school teaches children through age 18.
```

**How much does it cost?**

```
The cost is $60 for one student and $100 for a family. Financial assistance is available.
```

**What if tuition is a difficulty for us?**

```
Financial assistance is available and it is handled quietly. It is a normal part of how this school works, not an exception to it.
```

**How are children placed in classes?**

```
Arabic class placement is determined by placement test. Deen class placement is determined by the age of the student.
```

```
The Arabic test is short, it happens on the first day of school, and nobody passes or fails it. It exists so a child sits with others reading at the same level rather than others born the same year.
```

**How do I enroll?**

```
Through the enrollment form on this site. It takes a few minutes, and someone from the school will write back about placement.
```

### Group label: `THE PROGRAM`

**What is the Noorani method?**

```
A well-established approach to teaching Arabic recitation, which builds up from letters and their sounds to reading whole words and verses. It is what we use to teach children to read the Quran.
```

**What does Deen class cover?**

```
Deen is taught thematically rather than from a fixed textbook. The school takes a theme and every grade works on it in a way that suits its age, so a family with children of different ages is having one conversation at home rather than several.
```

**What is "...and in between"?**

```
The school's own name for the part of the program that is on no syllabus. The friendships, the questions asked in hallways, the habit of showing up. It is not scheduled and it is not optional.
```

**Do you give homework?**

```
Children have enough homework during the week. We don't give homework to children - we give it to the parents!
```

```
In practice: the school asks families to reinforce what is taught by doing it together. Praying, giving, serving the community. A child who is told about charity learns a word. A child who watches a parent give learns a habit.
```

### Group label: `PRACTICAL`

**When and where does class meet?**

```
Sundays, from 10:00 AM until Salat al-Dhuhr, September through May.
```

```
Classes are held at the Islamic Education Center, 7917 Montrose Rd, Potomac, MD 20854.
```

**Can I get involved?**

```
Parent feedback and volunteering is encouraged.
```

```
The school is run by the families in it. If you have an hour, a skill, or a strong opinion about how something should be done, the school would rather hear it than not. Write to info@ispmd.org.
```

**Is my donation tax-deductible?**

```
Yes. The Islamic School of Potomac is a 501(c)(3) non-profit organization, EIN 52-1989063. You can give through PayPal or by check.
```

**How do I reach the school?**

```
By phone at (301) 929-1441, or by email at info@ispmd.org. Both reach the people who actually run the Sunday morning.
```

## 3. Aside (pull quote)

```
We are more than a Sunday School. We are a community.
```

## 4. Still asking

**Headline** (`.t-display`)

```
Still asking?
```

**Body** (`.t-body`)

```
Write to info@ispmd.org. There is no wrong question and there is no queue.
```

**Buttons:** `info@ispmd.org` · `Get in touch`

---

# Give - `/give`

## 1. Masthead

**Label:** `SUPPORT THE SCHOOL`

**Headline** (`.t-hero`)

```
A school with
$60 tuition.
```

**Sub-line** (`.t-lead`, `--text-on-dark-soft`)

```
The rest of it is made up by people who decided a community should have a school in it.
```

## 2. Why

**Lead** (`.t-lead`)

```
The Islamic School of Potomac teaches children ages 5 through 18, thirty-three Sundays a year, and charges $60 a student to do it.
```

## 3. What $60 means here

**Label:** `WHERE THE MONEY GOES`

**Headline** (`.t-title`)

```
There is no endowment
and no marketing budget.
```

**Body** (`.t-body`)

```
Money given to this school goes into the Sunday morning: the books a class reads, the materials a teacher needs, the Deen Showcase in December, the Quran Competition in May. It is a short list because it is a small school, and every item on it is something a child touches.
```

**Card** (mono)

```
The Islamic School of Potomac is a
501(c)(3) non-profit organization.
Donations are tax-deductible.

EIN 52-1989063
```

## 4. Give

**Label:** `GIVE`

The three amounts are presentational. All three route to the same PayPal button, and none of them may say or imply that the amount is pre-filled.

| Amount | Line beneath |
|---|---|
| `$60` | `One student's tuition for the year.` |
| `$100` | `A family's tuition for the year.` |
| `$300` | `Five students, covered.` |

**Note beneath the tiles** (`.t-small`)

```
Any amount goes to the same place. Give once, or set up something monthly, with a card or a PayPal balance.
```

**Button:** `Give through PayPal`
Destination: `https://www.paypal.com/donate/?hosted_button_id=24GHPP5NMDF74`

## 5. By check

**Label:** `BY CHECK`

**Headline** (`.t-title`)

```
A check in the mail
still works.
```

**Body** (`.t-body`)

```
For plenty of families it is the easier thing, so it is not a footnote here. Make it out to the Islamic School of Potomac and send it to:
```

**Address card** (mono)

```
MAIL ONLY
Islamic School of Potomac
P.O. Box 833
Rockville, MD 20848-0833
```

## 6. Other ways

**Label:** `OTHER WAYS TO HELP`

**Headline** (`.t-title`)

```
Money is not the only
thing the school runs on.
```

**Body** (`.t-body`)

```
Parent feedback and volunteering is encouraged. An hour of your Sunday is worth real money to a school this size.
```

**Button:** `Get in touch`

---

# Contact - `/contact`

The page is organized by what a visitor wants to do, not by which channels exist.
Nothing on this page apologizes for what the school does not have. Both channels carry equal weight, and expectations are set plainly rather than hedged.

## 1. Masthead

**Label:** `CONTACT`

**Headline** (`.t-hero`, `--text-on-dark`)

```
Call, write, or come
on a Sunday.
```

## 2. Reach us

Two rows, equal typographic weight, in this order.

**Row one - phone** (`.t-title`, `href="tel:+13019291441"`)

```
(301) 929-1441
```

**Row two - email** (`.t-title`, `href="mailto:info@ispmd.org"`)

```
info@ispmd.org
```

**Beneath it** (`.t-body`)

```
A person reads this. It goes to the people who actually run the Sunday morning, so an answer usually comes back with something useful in it rather than a form reply.
```

**Three intent rows**, nested under the email row (each a `mailto:` with a pre-filled subject)

| Row label (`.t-subtitle`) | `mailto:` subject |
|---|---|
| `Enrolling a child` | `Enrolling a child` |
| `A question about the program` | `A question about the program` |
| `I'd like to volunteer` | `I'd like to volunteer` |

All three go to `info@ispmd.org`. Subjects are URL-encoded.

## 3. Where class meets

**Label:** `WHERE CLASS MEETS`

**Address** (mono)

```
Islamic Education Center
7917 Montrose Rd
Potomac, MD 20854
```

**Body** (`.t-body`)

```
Classes are held at the Islamic Education Center.
```

**Times** (`.t-subtitle`)

```
Sundays, 10:00 AM until Salat al-Dhuhr
September through May
```

**Link:** `Open in maps`

## 4. Post

**Label:** `MAIL ONLY`

**Address** (mono)

```
Islamic School of Potomac
P.O. Box 833
Rockville, MD 20848-0833
```

**Body** (`.t-small`)

```
This is a mailbox, not a classroom. Checks and paperwork go here; nobody is standing behind it.
```

## 5. Come on a Sunday

**Headline** (`.t-display`)

```
Better than either:
come and see.
```

**Body** (`.t-body`)

```
Sunday mornings between September and May, at the Islamic Education Center on Montrose Road. Call or write first so we know to look out for you, and someone will meet you at the door.
```

```
If you want one morning to pick, make it the Deen Showcase on December 13. It is the day the school is most itself.
```

**Buttons:** `(301) 929-1441` · `info@ispmd.org`

## 6. Elsewhere

**Label:** `ELSEWHERE`

| Link | Destination |
|---|---|
| `Instagram` | `https://www.instagram.com/ispmd/` |
| `Facebook` | `https://www.facebook.com/Islamic-School-of-Potomac-100899361744812` |

No claims about how recently either was updated. No embedded feed.

---

# 404

**Numeral** (`.t-mega`, `--text` at low opacity, behind the text block)

```
404
```

**Headline** (`.t-display`)

```
That page isn't here.
```

**Body** (`.t-body`)

```
The pattern continues, though. One of these will get you where you were going.
```

**Links:** `Go to the homepage` · `See the program` · `See the full year` · `Get in touch`

---

# Notes for implementers

1. **Line breaks inside fenced blocks are deliberate.** Where a headline is written across several lines, break it exactly there. Do not let it reflow into a different shape at desktop; use `<br>` or a `max-width` that produces the same break.
2. **The exclamation mark.** It appears twice, in the two settings of the teaching-philosophy line (homepage section 4, Program section 7). Both times it is its own `<span>` in `--amber`. There is no third exclamation mark on this site.
3. **The three verbatim lines** in the Voice section above are quoted exactly as the school wrote them. Do not correct, modernize or shorten them, including the capital S in "Sunday School" where it appears in the tagline.
4. **The Arabic string** is copied, never retyped. It appears twice: the homepage epigraph and the footer. The Program masthead reuses the same string.
5. **`{N} days`** on the calendar page is the only computed string in this file. Handle 0 and 1 as written.
6. **Every `mailto:` goes to `info@ispmd.org` and every `tel:` to `+13019291441`.** No other address or number exists anywhere on this site. The phone number is always *displayed* as `(301) 929-1441` and the `href` is always unformatted.
7. **Three sentences are flagged for confirmation** and are the only ones in this file that make a claim the school has not published:
   - `Enroll` section 3: "No child has ever been turned away from this school over $60."
   - `Enroll` section 5, step 02: "The school writes back" and its body, which describes a process rather than a published fact.
   - `Contact` section 5: "someone will meet you at the door."
   Each works if deleted. Confirm or cut before cutover; do not soften them into vagueness.
8. **"Volunteer-run"** does not appear as a phrase anywhere in this deck. The idea is carried by describing what volunteers actually do, which is both truer and more persuasive, and it means nothing has to be retracted if the framing turns out to be imprecise.




