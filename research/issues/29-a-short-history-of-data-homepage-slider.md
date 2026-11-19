# #29 Research: a short history of data (homepage slider)

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/29 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#29](https://github.com/datafromzero/datafromzero.github.io/issues/29) (closed), opened 2026-11-16

## Type

Curriculum gap

## Summary

## A short history of data — for the homepage slider "From punch cards to AI"

**Type:** Content research (homepage). **Priority:** Medium.
**Access date for every source below: 2026-11-16.** Every source was opened and checked against the fact it supports. Facts are stated in our own words; no text is copied from sources, and no images are used, so no image rights are involved.

## Method and verdict on the draft

All 11 draft milestones were verified against a primary source and an independent second source. **None was weak enough to replace.** Four needed wording or precision fixes:

- **VisiCalc (1979):** the title "The first spreadsheet app" overclaims — spreadsheet ideas existed on mainframes (Mattessich 1961, LANPAR 1969). Supported claim: first spreadsheet *for personal computers*. Exact release date found: 1979-10-17.
- **pandas (2008):** the card must say pandas *begins* in 2008. It was not released that year — McKinney's own account says the code stayed proprietary for about the first year and a half; it was open-sourced in 2009. (Wikipedia's infobox "release 11 Jan 2008" contradicts its own history section and the creator; do not use it.)
- **Python (1991):** exact date confirmed from the creator's own timeline: 1991-02-20 (0.9.0, released to alt.sources). One source labels the February 1991 posting 0.9.1; the card follows the creator's account (0.9.0). Month and year are undisputed.
- **ChatGPT (2022):** title tightened to "AI in a chat box". No user or growth numbers are used — none appear in OpenAI's announcement, and the figures quoted elsewhere are company or analyst claims.

One slot was open (11 draft cards, slider holds 10–12). It goes to the **1804 Jacquard loom**, the documented origin of the punched cards the slider's own title names. Three further verified candidates are listed as alternates, and six as considered and dropped, each with reasons.

## Recommended final list — 12 cards, in order

### 1. 1804 — A loom reads punched cards
- **Date:** 1804 (patent year; the attachment was introduced across 1804–05)
- **Line:** Jacquard's loom weaves patterns stored as holes in interchangeable punched cards.
- **Why it matters:** The cards were data a machine could read — hole or no hole — the same "store it where a machine can use it" idea behind every table and file on this path.
- **Primary source:** Science and Industry Museum (Science Museum Group), "Programming patterns: the story of the Jacquard loom" — https://www.scienceandindustrymuseum.org.uk/objects-and-stories/jacquard-loom
- **Second source:** Encyclopaedia Britannica, "Joseph-Marie Jacquard" — https://www.britannica.com/biography/Joseph-Marie-Jacquard
- **Confidence:** high — a national museum group and Britannica agree on the inventor, the 1804 patent, the card mechanism, and the documented line from Jacquard's cards to Babbage and Hollerith.
- **Disputes:** Jacquard demonstrated an improved drawloom in 1801, and some references date "the Jacquard mechanism" to 1801; 1804 is the patent year for the punched-card attachment. He was not the first to use punched cards (Falcon, 1728; Bouchon used perforated tape, 1725) — his contribution was a practical, widely adopted system, so the card makes no "first" claim.

### 2. 1890 — Punched cards count a country
- **Date:** 1890 (Census Day 1890-06-01; enumeration began June 2, as June 1 was a Sunday)
- **Line:** Herman Hollerith's electric tabulators process the US Census.
- **Why it matters:** Each card held one person's answers as holes in fixed positions — a row of data — the same record-and-aggregate idea behind a spreadsheet table or a SQL GROUP BY.
- **Primary source:** US Census Bureau, "The Hollerith Machine" — https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html
- **Second source:** Smithsonian National Museum of American History, "Hollerith Tabulating Machine" (object record) — https://www.si.edu/object/hollerith-tabulating-machine:nmah_694410
- **Confidence:** high — the agency that ran the census and a national museum's artifact record agree on the inventor, the technology, and its use in 1890.
- **Disputes:** None on the core fact. "Electric" is the Census Bureau's own wording ("electric tabulating system"); the machines are also described as electromechanical, since clerks fed cards by hand. Hollerith's patent was issued in January 1889 — 1890 is the year of first census use, not of invention.

### 3. 1970 — Data gets tables
- **Date:** 1970-06 (Communications of the ACM 13(6), June 1970, pp. 377–387)
- **Line:** IBM researcher Edgar F. Codd proposes storing data in simple tables of rows and columns.
- **Why it matters:** Every table you create, and every JOIN and GROUP BY you write in SQL, follows the relational model this paper defined.
- **Primary source:** E. F. Codd, "A Relational Model of Data for Large Shared Data Banks", ACM Digital Library — https://dl.acm.org/doi/10.1145/362384.362685
- **Second source:** Wikipedia, "A Relational Model of Data for Large Shared Data Banks" — https://en.wikipedia.org/wiki/A_Relational_Model_of_Data_for_Large_Shared_Data_Banks
- **Confidence:** high — the publisher's record and the encyclopedia agree on author, venue, volume, issue, pages and month.
- **Disputes:** The 1970 paper revises Codd's IBM internal report RJ599 of August 19, 1969, which the ACM Turing bibliography calls his first relational-model paper; 1970 is "generally credited" as the seminal public debut. No source disputes the June 1970 publication itself.

### 4. 1974 — SQL is born
- **Date:** 1974-05 (Proc. ACM SIGFIDET Workshop 1974, pp. 249–264)
- **Line:** At IBM, Chamberlin and Boyce describe SEQUEL, an English-like language for asking questions of tables.
- **Why it matters:** The SELECT, FROM and WHERE clauses you type in your first SQL lesson descend directly from SEQUEL's keyword templates.
- **Primary source:** Chamberlin & Boyce, "SEQUEL: A Structured English Query Language", ACM Digital Library — https://dl.acm.org/doi/10.1145/800296.811515
- **Second source:** Wikipedia, "SQL" (History) — https://en.wikipedia.org/wiki/SQL
- **Confidence:** high — the ACM proceedings record and the encyclopedia agree on authors, venue, year and month.
- **Disputes:** Wikipedia's infobox says SQL "first appeared 1973" — design work began in 1973, after the earlier language SQUARE; the paper itself is May 1974. SEQUEL was shortened to SQL because "SEQUEL" was a trademark of the UK firm Hawker Siddeley Dynamics Engineering; Chamberlin later dated the rename to 1977. Context only: Oracle V2 (June 1979) is described as "one of the first commercially available implementations of SQL" — keep that wording hedged; IBM's System/38 also shipped in 1979.

### 5. 1979 — The first personal-computer spreadsheet
- **Date:** 1979-10-17 (production release, for the Apple II)
- **Line:** VisiCalc turns a personal computer into a business tool.
- **Why it matters:** The grid, cell references and formulas you use in Excel and Google Sheets today follow the model VisiCalc set.
- **Primary source:** Dan Bricklin and Bob Frankston (the creators), "VisiCalc: Information from its creators" — https://danbricklin.com/visicalc.htm
- **Second source:** Wikipedia, "VisiCalc" — https://en.wikipedia.org/wiki/VisiCalc
- **Confidence:** high — the creators' own site and the encyclopedia agree on the product, platform and year; the exact day comes from co-creator Bob Frankston's account as cited by Wikipedia.
- **Disputes:** VisiCalc was publicly shown on June 4, 1979, and a few copies sold that summer; October 17, 1979 is the production release. "First" needs its qualifier: computerized spreadsheet ideas existed earlier on mainframes (Mattessich 1961; LANPAR 1969), so the supported claim is first spreadsheet program for personal computers.

### 6. 1985 — Excel arrives on the Macintosh
- **Date:** 1985-09-30
- **Line:** Microsoft ships Excel 1.0 for the Macintosh.
- **Why it matters:** Excel is the tool this roadmap starts from, and its basic layout and core functions still match that first Macintosh version.
- **Primary source:** Microsoft (Signal), "Formulas, fandom and an AI-fueled future — Microsoft Excel celebrates 40 years" — https://news.microsoft.com/signal/articles/microsoft-excel-celebrates-40-years/ (confirms the 1985 launch; the exact day rests on the second source and wide independent agreement)
- **Second source:** Wikipedia, "Microsoft Excel" — https://en.wikipedia.org/wiki/Microsoft_Excel
- **Confidence:** high — Microsoft confirms the 1985 launch, and September 30, 1985 is consistent across the encyclopedia and multiple independent sources; no competing release date was found.
- **Disputes:** Excel was publicly announced earlier, on May 2, 1985; September 30 is the on-sale date. Excel was not Microsoft's first spreadsheet — Multiplan came first, in 1982.

### 7. 1991 — Python's first public release
- **Date:** 1991-02-20
- **Line:** Guido van Rossum publishes Python 0.9.0, the language's first public release.
- **Why it matters:** Python is the language this roadmap's third stage teaches, and pandas, Jupyter and scikit-learn all build on it.
- **Primary source:** Guido van Rossum, "A Brief Timeline of Python", in *The History of Python* (the creator's own timeline; full-text mirror) — https://github.com/eltonlaw/the-history-of-python/raw/refs/heads/master/the-history-of-python.pdf
- **Second source:** Wikipedia, "History of Python" — https://en.wikipedia.org/wiki/History_of_Python
- **Confidence:** high — the exact day comes from the creator's own dated timeline, and the encyclopedia agrees on February 1991.
- **Disputes:** Wikipedia's current text labels the code first published in February 1991 as version 0.9.1, while van Rossum's own timeline calls the February 20, 1991 alt.sources release 0.9.0. The card follows the creator's account; the month and year are not in dispute.

### 8. 2006 — Hadoop brings big data open source
- **Date:** 2006-04 (Apache changelog dates release 0.1.0 to 2006-04-02)
- **Line:** Apache Hadoop 0.1.0 is released, spreading data work across many ordinary machines.
- **Why it matters:** Hadoop's split-the-work idea still sits underneath the cloud data platforms beginners meet on the job.
- **Primary source:** Apache Hadoop project, "Release 0.1.0 changelog" — https://hadoop.apache.org/docs/r3.4.0/hadoop-project-dist/hadoop-common/release/0.1.0/CHANGELOG.0.1.0.html
- **Second source:** Wikipedia, "Apache Hadoop" — https://en.wikipedia.org/wiki/Apache_Hadoop
- **Confidence:** high — the project's own release archive and the encyclopedia agree on April 2006, the origin in Nutch, and the creators (Doug Cutting and Mike Cafarella).
- **Disputes:** Wikipedia's infobox dates 0.1.0 to April 1, 2006, one day before Apache's own changelog date of April 2. Month and year are safe; if an exact day is printed, use Apache's 2006-04-02.

### 9. 2008 — pandas brings tables to Python
- **Date:** 2008 (development began at AQR; no exact date is sourced, and none should be printed)
- **Line:** Wes McKinney starts building pandas at AQR, bringing spreadsheet-style tables to Python.
- **Why it matters:** pandas is still the first tool most beginners reach for when cleaning and exploring a table in Python.
- **Primary source:** "Wes McKinney", GitHub Readme Stories (the creator's own account) — https://github.com/readme/stories/wes-mckinney
- **Second source:** Wikipedia, "Pandas (software)" (History) — https://en.wikipedia.org/wiki/Pandas_(software)
- **Confidence:** high — the creator's account and the encyclopedia agree that work began at AQR in 2008 and that the public release came later (open-sourced 2009).
- **Disputes:** Wikipedia's infobox lists an initial release of "11 January 2008", which conflicts with its own History section and with McKinney's account (proprietary for roughly the first year and a half). The card says pandas *begins* in 2008 and must never claim a 2008 release.

### 10. 2012 — A job gets a name
- **Date:** 2012-10 (October 2012 issue)
- **Line:** Harvard Business Review names data scientist the sexiest job of the 21st century.
- **Why it matters:** The data careers at the end of this roadmap became named, hirable jobs in the years around this article.
- **Primary source:** Davenport & Patil, "Data Scientist: The Sexiest Job of the 21st Century", Harvard Business Review — https://hbr.org/2012/10/data-scientist-the-sexiest-job-of-the-21st-century
- **Second source:** IEEE Spectrum, "Is Data Scientist the Sexiest Job of Our Time?", 2012-09-27 — https://spectrum.ieee.org/is-data-scientist-the-sexiest-job-of-our-time
- **Confidence:** high — HBR's own page confirms the title, authors and October 2012 issue; IEEE Spectrum confirms independently. ("Sexiest job" is the article's own title, quoted — not an added claim.)
- **Disputes:** The article popularized the title rather than inventing it: the article itself says "data scientist" was coined in 2008 by co-author D.J. Patil and Jeff Hammerbacher at LinkedIn and Facebook. Davenport has said in later interviews that "sexiest" was an editor's wording.

### 11. 2017 — The Transformer
- **Date:** 2017-06-12 (arXiv v1 submission)
- **Line:** A paper, Attention Is All You Need, introduces the Transformer, the design behind today's AI models.
- **Why it matters:** The AI assistants you can now use while learning are built on this design, and they run on data prepared with skills from this roadmap.
- **Primary source:** Vaswani et al., "Attention Is All You Need", arXiv:1706.03762 — https://arxiv.org/abs/1706.03762
- **Second source:** NeurIPS 2017 proceedings, "Attention is All you Need" — https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html
- **Confidence:** high — arXiv's own submission history gives the exact date, and the NeurIPS proceedings confirm the 2017 conference publication.
- **Disputes:** None on date or authorship. One nuance: attention mechanisms existed before this paper (Bahdanau et al., 2014); the paper's contribution was an architecture based solely on attention, so the line credits it with the Transformer design, not with inventing attention.

### 12. 2022 — AI in a chat box
- **Date:** 2022-11-30
- **Line:** OpenAI releases ChatGPT: a large language model anyone can talk to in a chat box.
- **Why it matters:** AI tools like this now sit next to your spreadsheet and code editor, and judging their answers takes the data skills in this roadmap.
- **Primary source:** OpenAI, "Introducing ChatGPT" (November 30, 2022) — https://openai.com/index/chatgpt/
- **Second source:** Simple English Wikipedia, "ChatGPT" — https://simple.m.wikipedia.org/wiki/ChatGPT
- **Confidence:** high — OpenAI's own announcement and the encyclopedia agree on the launch date, the GPT-3.5 basis and the research-preview framing.
- **Disputes:** None on the launch date. Neutral notes: ChatGPT was released as a research preview, not a finished product, and the GPT-3.5 series had finished training in early 2022 — 2022-11-30 is the public chat launch, not the date the model was built.

**Closing card (site copy, not a researched milestone):** "Now — Your turn." The learner's own first spreadsheet, query and script continue the story; no source needed.

## Alternates — verified and ready if the slider takes a 13th card, or to swap in

1. **2006 — Spreadsheets move to the web** (first alternate). Date 2006-06-06. Line: "Google Spreadsheets opens as a limited test, letting people edit one spreadsheet together in a browser." Why it matters: Google Sheets is the free spreadsheet many beginners start in; sharing one live file replaced emailing copies back and forth. Primary: Official Google Blog, "It's nice to share", 2006-06-06 — https://googleblog.blogspot.com/2006/06/its-nice-to-share.html. Second: Wikipedia, "Google Sheets" — https://en.wikipedia.org/wiki/Google_Sheets. Confidence: high (Google's dated announcement, its same-day press release and the encyclopedia agree). Dispute: Wikipedia's infobox shows March 9, 2006 — that is the Writely acquisition date; the launch was June 6, as a limited test. *Why it missed the 12:* the story already carries two spreadsheet cards (1979, 1985) and the 2006 beat belongs to Hadoop in the draft; this is the only candidate we would promote if a slot opens.
2. **1993 — PivotTables arrive in Excel.** Date 1993 (Microsoft's version history dates Excel 5.0 to 1993-12-14 and lists the PivotTable Wizard). Line: "Excel 5.0 adds PivotTables, which summarize a table by dragging fields instead of writing formulas." Why it matters: a PivotTable is the spreadsheet form of grouping and totaling — the same idea later written as GROUP BY in SQL. Primary: Microsoft KB Q66913, "Version History of Microsoft Excel for Windows" (archived copy) — https://www.betaarchive.com/wiki/index.php/Microsoft_KB_Archive/66913. Second: Wikipedia, "Pivot table" — https://en.wikipedia.org/wiki/Pivot_table. Confidence: high that PivotTables arrived with Excel 5.0; medium on the year boundary — Microsoft dates the release to December 14, 1993, Wikipedia's pivot article says "early in 1994"; we follow Microsoft's own record. Dispute: the pivot concept is Lotus's (Pito Salas; shipped in Lotus Improv, 1991), not Microsoft's invention. *Why it missed the 12:* it is a feature inside a tool already on the list, and it belongs to the Excel stage's own story; strongest of the Excel candidates if a spreadsheet feature card is ever wanted.
3. **2011 — Notebooks mix code and notes.** Date 2011-12 (IPython 0.12; the move to Project Jupyter followed in 2015). Line: "IPython 0.12 ships a browser notebook mixing code, results and written notes." Why it matters: Jupyter notebooks are where many beginners write, run and share their first Python analysis today. Primary: "25 Years of Interactive Scientific Computing", Proceedings of the SciPy Conference — https://proceedings.scipy.org/articles/avte6646. Second: LIMSWiki, "Jupyter Notebook" — https://www.limswiki.org/index.php/Jupyter_Notebook. Confidence: high. Dispute: only a minor framing difference on the 2015 split (July 30 vs August 11, 2015); the 2011 date is agreed. Notebook interfaces predate IPython (e.g. Mathematica, 1988), so the card claims only the browser notebook inside IPython. *Why it missed the 12:* Python and pandas already carry the Python beat for a homepage audience; this card fits the Python stage page better.

## Considered and dropped

- **Playfair's charts (1786)** — facts are solid (University of Chicago Special Collections; Cambridge University Press), but it is a data-visualization milestone in a slider titled "From punch cards to AI"; it would leave the 1890 card's punched cards unexplained. Hold in reserve for a charts story.
- **Excel for Windows (1987)** — verified (Microsoft KB: Excel 2.0, 1987-10-31; Wikipedia: 2.05, 1987-11-19 — the exact day is disputed), but it is the same product as the 1985 card on a second platform and adds no new idea for a beginner.
- **Power Query (2013)** — verified (Microsoft: general availability under the Power Query name 2013-07-08; codename "Data Explorer", first announced 2011). Job-relevant, but a deep-cut feature inside Excel; it belongs to the Excel stage, not the homepage story.
- **scikit-learn (2010)** — verified (started 2007 as a Google Summer of Code project; first public release 2010-02-01, per the project's own history). Machine-learning library material for the DS/ML track pages; at homepage level the AI beat is carried by 2017 and 2022.
- **Cloud data warehouse — BigQuery (2010)** — the earliest clean representative (announced 2010-05-19; Redshift announced 2012, Snowflake generally available June 2015), but only the announcement date is solid: general-availability dating is genuinely disputed (November 2011 vs 2012 vs May 2012 across sources, including Wikipedia contradicting itself). Data-engineering track material; a card needs a crisper fact.
- **dbt (2016)** — verified (founder's own history and the encyclopedia agree it began in 2016, open source from the start; origin framed as RJMetrics by Wikipedia and as Fishtown Analytics by dbt Labs). Analytics-engineering track material; it overlaps the SQL stage more than any other candidate overlaps its stage.

## Source table (all accessed 2026-11-16)

| # | Source | Supports | URL |
|---|--------|----------|-----|
| 1 | Science and Industry Museum, "Programming patterns: the story of the Jacquard loom" | 1804 Jacquard (primary) | https://www.scienceandindustrymuseum.org.uk/objects-and-stories/jacquard-loom |
| 2 | Encyclopaedia Britannica, "Joseph-Marie Jacquard" | 1804 Jacquard (second) | https://www.britannica.com/biography/Joseph-Marie-Jacquard |
| 3 | US Census Bureau, "The Hollerith Machine" | 1890 Hollerith (primary) | https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html |
| 4 | US Census Bureau, "About the 1890 Decennial Census" | Census Day 1890-06-01 | https://www.test.census.gov/programs-surveys/decennial-census/decade/1890/about-1890.html |
| 5 | Smithsonian NMAH, "Hollerith Tabulating Machine" | 1890 Hollerith (second) | https://www.si.edu/object/hollerith-tabulating-machine:nmah_694410 |
| 6 | Codd, "A Relational Model of Data for Large Shared Data Banks", ACM DL | 1970 Codd (primary) | https://dl.acm.org/doi/10.1145/362384.362685 |
| 7 | Wikipedia, "A Relational Model of Data for Large Shared Data Banks" | 1970 Codd (second) | https://en.wikipedia.org/wiki/A_Relational_Model_of_Data_for_Large_Shared_Data_Banks |
| 8 | Chamberlin & Boyce, "SEQUEL: A Structured English Query Language", ACM DL | 1974 SEQUEL (primary) | https://dl.acm.org/doi/10.1145/800296.811515 |
| 9 | Wikipedia, "SQL" | 1974 SEQUEL (second) | https://en.wikipedia.org/wiki/SQL |
| 10 | Bricklin & Frankston, "VisiCalc: Information from its creators" | 1979 VisiCalc (primary) | https://danbricklin.com/visicalc.htm |
| 11 | Wikipedia, "VisiCalc" | 1979 VisiCalc (second) | https://en.wikipedia.org/wiki/VisiCalc |
| 12 | Microsoft Signal, "Microsoft Excel celebrates 40 years" | 1985 Excel (primary) | https://news.microsoft.com/signal/articles/microsoft-excel-celebrates-40-years/ |
| 13 | Wikipedia, "Microsoft Excel" | 1985 Excel (second) | https://en.wikipedia.org/wiki/Microsoft_Excel |
| 14 | Van Rossum, "A Brief Timeline of Python" (full-text mirror) | 1991 Python (primary) | https://github.com/eltonlaw/the-history-of-python/raw/refs/heads/master/the-history-of-python.pdf |
| 15 | Wikipedia, "History of Python" | 1991 Python (second) | https://en.wikipedia.org/wiki/History_of_Python |
| 16 | Apache Hadoop, "Release 0.1.0 changelog" | 2006 Hadoop (primary) | https://hadoop.apache.org/docs/r3.4.0/hadoop-project-dist/hadoop-common/release/0.1.0/CHANGELOG.0.1.0.html |
| 17 | Wikipedia, "Apache Hadoop" | 2006 Hadoop (second) | https://en.wikipedia.org/wiki/Apache_Hadoop |
| 18 | GitHub Readme Stories, "Wes McKinney" | 2008 pandas (primary) | https://github.com/readme/stories/wes-mckinney |
| 19 | Wikipedia, "Pandas (software)" | 2008 pandas (second) | https://en.wikipedia.org/wiki/Pandas_(software) |
| 20 | Harvard Business Review, "Data Scientist: The Sexiest Job of the 21st Century" | 2012 HBR (primary) | https://hbr.org/2012/10/data-scientist-the-sexiest-job-of-the-21st-century |
| 21 | IEEE Spectrum, "Is Data Scientist the Sexiest Job of Our Time?" | 2012 HBR (second) | https://spectrum.ieee.org/is-data-scientist-the-sexiest-job-of-our-time |
| 22 | Vaswani et al., "Attention Is All You Need", arXiv:1706.03762 | 2017 Transformer (primary) | https://arxiv.org/abs/1706.03762 |
| 23 | NeurIPS 2017 proceedings, "Attention is All you Need" | 2017 Transformer (second) | https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html |
| 24 | OpenAI, "Introducing ChatGPT" | 2022 ChatGPT (primary) | https://openai.com/index/chatgpt/ |
| 25 | Simple English Wikipedia, "ChatGPT" | 2022 ChatGPT (second) | https://simple.m.wikipedia.org/wiki/ChatGPT |
| 26 | Official Google Blog, "It's nice to share" (2006-06-06) | Alternate: Google Spreadsheets (primary) | https://googleblog.blogspot.com/2006/06/its-nice-to-share.html |
| 27 | Wikipedia, "Google Sheets" | Alternate: Google Sheets (second) | https://en.wikipedia.org/wiki/Google_Sheets |
| 28 | Microsoft KB Q66913, "Version History of Microsoft Excel for Windows" (archived) | Alternate: PivotTables; dropped: Excel for Windows | https://www.betaarchive.com/wiki/index.php/Microsoft_KB_Archive/66913 |
| 29 | Wikipedia, "Pivot table" | Alternate: PivotTables (second) | https://en.wikipedia.org/wiki/Pivot_table |
| 30 | SciPy Proceedings, "25 Years of Interactive Scientific Computing" | Alternate: Jupyter (primary) | https://proceedings.scipy.org/articles/avte6646 |
| 31 | LIMSWiki, "Jupyter Notebook" | Alternate: Jupyter (second) | https://www.limswiki.org/index.php/Jupyter_Notebook |
| 32 | Microsoft Learn archive, "'Data Explorer' is now Microsoft Power Query for Excel" (2013-07-08) | Dropped: Power Query (primary) | https://learn.microsoft.com/en-us/archive/blogs/dataexplorer/data-explorer-is-now-microsoft-power-query-for-excel |
| 33 | Wikipedia, "Power Query" | Dropped: Power Query (second) | https://en.wikipedia.org/wiki/Power_Query |
| 34 | scikit-learn, "About us" (project history) | Dropped: scikit-learn (primary) | https://scikit-learn.org/1.8/about.html |
| 35 | Wikipedia, "Scikit-learn" | Dropped: scikit-learn (second) | https://en.wikipedia.org/wiki/Scikit-learn |
| 36 | Google Developers Blog, "Google BigQuery Service" (2011-11-14) | Dropped: BigQuery (primary) | https://developers.googleblog.com/google-bigquery-service-big-data-analytics-at-google-speed/ |
| 37 | Wikipedia, "Google BigQuery" | Dropped: BigQuery (second) | https://en.wikipedia.org/wiki/Google_BigQuery |
| 38 | dbt Labs blog, "New era, new engine, and new names" (2025-05-28) | Dropped: dbt (primary) | https://www.getdbt.com/blog/updated-names-for-dbt-platform-and-features |
| 39 | Wikipedia, "Data build tool" | Dropped: dbt (second) | https://en.wikipedia.org/wiki/Data_build_tool |
| 40 | University of Chicago Special Collections, Playfair's *Commercial and Political Atlas* | Dropped: Playfair (primary) | https://fathom.lib.uchicago.edu/2/21701730/21701730_playfair.html |

## Suggested action

Build the slider with the 12 cards above, plus the closing "Now — Your turn" card. If the design later allows a 13th card, add Google Spreadsheets (2006) between Hadoop and pandas — it is fully verified and needs no further research. Keep the dispute notes out of the card text; they are here so any future edit stays honest.

## Evidence

All 40 sources are listed in full in the Source table in Summary; every source was accessed 2026-11-16. One line per card (primary / second):
- 1804 Jacquard: https://www.scienceandindustrymuseum.org.uk/objects-and-stories/jacquard-loom / https://www.britannica.com/biography/Joseph-Marie-Jacquard — accessed 2026-11-16
- 1890 Hollerith: https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html / https://www.si.edu/object/hollerith-tabulating-machine:nmah_694410 — accessed 2026-11-16
- 1970 Codd: https://dl.acm.org/doi/10.1145/362384.362685 / https://en.wikipedia.org/wiki/A_Relational_Model_of_Data_for_Large_Shared_Data_Banks — accessed 2026-11-16
- 1974 SEQUEL: https://dl.acm.org/doi/10.1145/800296.811515 / https://en.wikipedia.org/wiki/SQL — accessed 2026-11-16
- 1979 VisiCalc: https://danbricklin.com/visicalc.htm / https://en.wikipedia.org/wiki/VisiCalc — accessed 2026-11-16
- 1985 Excel: https://news.microsoft.com/signal/articles/microsoft-excel-celebrates-40-years/ / https://en.wikipedia.org/wiki/Microsoft_Excel — accessed 2026-11-16
- 1991 Python: https://github.com/eltonlaw/the-history-of-python/raw/refs/heads/master/the-history-of-python.pdf / https://en.wikipedia.org/wiki/History_of_Python — accessed 2026-11-16
- 2006 Hadoop: https://hadoop.apache.org/docs/r3.4.0/hadoop-project-dist/hadoop-common/release/0.1.0/CHANGELOG.0.1.0.html / https://en.wikipedia.org/wiki/Apache_Hadoop — accessed 2026-11-16
- 2008 pandas: https://github.com/readme/stories/wes-mckinney / https://en.wikipedia.org/wiki/Pandas_(software) — accessed 2026-11-16
- 2012 HBR: https://hbr.org/2012/10/data-scientist-the-sexiest-job-of-the-21st-century / https://spectrum.ieee.org/is-data-scientist-the-sexiest-job-of-our-time — accessed 2026-11-16
- 2017 Transformer: https://arxiv.org/abs/1706.03762 / https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html — accessed 2026-11-16
- 2022 ChatGPT: https://openai.com/index/chatgpt/ / https://simple.m.wikipedia.org/wiki/ChatGPT — accessed 2026-11-16

## Affected datafromzero pages

/ (homepage slider "From punch cards to AI")

## Suggested action

Build the slider with the 12 cards above, plus the closing "Now — Your turn" card. If the design later allows a 13th card, add Google Spreadsheets (2006) between Hadoop and pandas — it is fully verified and needs no further research. Keep the dispute notes out of the card text; they are here so any future edit stays honest.

## Priority

Medium - outdated but still correct, or a clear beginner-level gap

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites
