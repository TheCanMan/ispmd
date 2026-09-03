# Image generation brief - 20 slots

Use this with the Gemini app, ChatGPT, or any generator. Paste the house style once, then each slot's prompt.
Save every file named exactly by its slot id (e.g. `enroll.sunday.png`) into one folder and hand me the folder.
I crop to ratio, run the palette grade, write honest alt text, and swap the registry - no layout changes.

## House style - paste this before every prompt

> Documentary-style photograph, candid, unposed, soft natural morning light through windows.
> A modest suburban community-center classroom in Maryland: plain walls, stacking chairs, folding tables, carpet or wood floor.
> Muslim families - children of mixed ages and backgrounds, modest dress, women in hijab, men in ordinary clothes.
> Palette: cool and green-leaning - sage, moss, cream-white, deep green shadows. No orange, gold, amber, or warm brown tones.
> No one looks at the camera. Faces in profile, from behind, or softly out of focus. Hands and objects sharp.
> No visible text, signage, logos, or lettering anywhere in the frame. No mosque architecture, domes, arches, or decorative Islamic pattern.
> Realistic, not stylised. No illustration or painterly look.

Two hard rules the generators get wrong:

1. **Never let a generator draw Arabic script.** It produces gibberish that any Arabic reader will spot instantly. For anything with a Quran or a workbook, keep the page angled away, out of focus, or edge-on. The `program.arabic` slot is the riskiest - ask for a child's hand holding a pencil over a page seen at a steep angle so the letters are unreadable.
2. **No faces to camera.** Generated faces of children are the thing that makes a site look fake. Profile, back-of-head, hands, and soft focus read as honest.

## Sizes

Generate at the largest size the tool allows. I crop. Orientation matters more than exact pixels:

| Ratio | Orientation | Slots |
|---|---|---|
| 21/9 | wide landscape | story.opening, give.impact, home.community.wide |
| 16/9 | landscape | enroll.sunday, program.showcase |
| 5/4 | landscape | story.volunteers, program.arabic, program.between, give.classroom, contact.venue, home.calendar.room |
| 4/5 | portrait | enroll.classroom, story.families, program.deen, faqs.aside, home.program.arabic |
| 1/1 | square | calendar.milestone.showcase, calendar.milestone.exams, calendar.milestone.quran |

## Prompts, one per slot

**enroll.sunday** (16/9) - the most important one
> Wide shot of a community-center classroom on a Sunday morning, seen from the doorway. Eight to ten children seated at folding tables with open books, a woman in hijab standing at the front, everyone seen from behind or in profile. Morning light from a side window.

**home.community.wide** (21/9)
> Very wide shot from a doorway: a full multipurpose room with children and adults together, some seated, some standing at the edges talking. Seen from behind, no faces toward camera.

**story.opening** (21/9)
> Wide shot of a plain double doorway into a community building with families arriving - a parent holding a child's hand, seen from behind, walking in. Morning light.

**story.families** (4/5)
> An adult and a child seated side by side at a table, reading together from a book, both in profile. The book angled away from camera so the page is unreadable.

**story.volunteers** (5/4)
> Two adults setting out stacking chairs in rows in an empty classroom, mid-motion, seen from behind. Practical, unposed.

**program.arabic** (5/4) - handle with care
> Close shot of a child's hand holding a pencil over a lined workbook, seen at a steep angle from the side so the page is unreadable. Shallow depth of field. Nothing legible.

**home.program.arabic** (4/5)
> Top-down shot of a child's hands resting on an open book on a wooden table. The page soft and unreadable. Hands sharp.

**program.deen** (4/5)
> Six children seated in a circle on a carpeted floor, talking, all in profile or from behind. A woman in hijab seated among them. Relaxed.

**program.between** (5/4)
> A corridor in a community building with children walking between rooms, slightly loose framing, motion blur on one figure. From behind.

**program.showcase** (16/9)
> A multipurpose room set up with rows of chairs facing a low stage, an audience of families seated, seen from the very back of the room. One child standing at the front, small in frame, facing away from camera.

**enroll.classroom** (4/5)
> A small class of six children at a table with an adult, seen in profile from the side of the room. Books open, pages angled away.

**faqs.aside** (4/5)
> A single child seated by a window, looking at something out of frame to the side. Quiet. Profile only.

**give.impact** (21/9)
> A full room of families seen from the back, standing and seated, filling the frame edge to edge. Scale, not detail. No faces toward camera.

**give.classroom** (5/4)
> A shelf of children's books and workbooks with a box of pencils and a stack of paper. Objects only. Plain, honest, no glamour.

**contact.venue** (5/4)
> An ordinary empty classroom seen in morning light through a window. Chairs, a table, a plain wall. No people, no identifying architecture.

**home.calendar.room** (5/4)
> An empty classroom with chairs set out in neat rows before anyone arrives. Morning light. Anticipation.

**calendar.milestone.showcase** (1/1)
> A child standing at the front of a small room, facing a seated group, seen from behind the child's shoulder.

**calendar.milestone.exams** (1/1)
> Papers, pencils and an eraser on a desk in soft light. Objects only. Calm, not stressful.

**calendar.milestone.quran** (1/1)
> A crowded gathering at the front of a room, families standing close together, warm and busy, seen from behind. Last day of school.

## The hero video (home.hero.montage)

8-12 seconds of cut coverage, landscape, 16/9: arriving at a door, a classroom from the back, a child reading aloud in profile, parents talking in a hallway. No face held longer than 1.5 seconds.
Video generation is paid-only on both Gemini (Veo) and ChatGPT (Sora) as far as I can tell.
If you don't have a subscription, the current code-generated 3D hero stays - the site is complete without the montage, and this slot is built to take real footage the day you have it.

## What I do when the folder lands

1. Crop each file to its slot ratio and check it clears the minimum size.
2. Run the green palette grade so generated images sit in the family.
3. Write alt text that says what is actually in the frame, prefixed "Illustration:" - never claiming these are ISP students.
4. Swap the registry entries and rebuild. Zero layout changes.

## A note on real photos

Real photos of the school beat everything on this list, and this whole system was built so they drop in the same way.
One parent with a phone on one Sunday, shooting from doorways and from behind, covers most of these twenty slots.
If Ahmed can arrange that, skip generation entirely.
