# #107 Research: Module 3 knowledge pack — domain and data modeling (design workflow, ER diagrams, UML, multiplicity)

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/107 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#107](https://github.com/datafromzero/datafromzero.github.io/issues/107) (open), opened 2026-11-21

**Why this issue exists:** The modeling knowledge in Module 3 of the DBMS course map (Domain and Data Modeling) is not findable on the open web in one place — it lives in the Owner's course archive (8 lessons: design workflow, ER diagrams, UML class diagrams, UML multiplicity, relationship types, a UML workshop, a logical-modeling case, and a many-to-many quick-take). This pack distills that knowledge in our own words and attaches the authoritative public sources, so the SQL stage's modeling lessons (see #52) and the advanced core's modeling content can be built against it. No lesson text is copied; concepts and rules are restated.

**Module scope:** Design Workflow · ER Diagrams · UML Class Diagrams · UML Multiplicity · Relationship Types · UML Workshop · Logical Data Modeling (case) · Resolving Many-to-Many Relationships.

---

## 1. The database design workflow

Design runs as an iterative loop, not a straight line — any phase can send you back to an earlier one:

1. **Gather requirements** — stakeholder interviews, document review, observing the work, surveys → output: a requirements specification.
2. **Analyse requirements** — hunt for ambiguity and gaps, confirm readings with stakeholders, examine any existing system → output: defined scope + a first data model.
3. **Conceptual design** — an ER diagram or UML class diagram, validated with stakeholders → output: diagram + data dictionary.
4. **Logical design** — convert the conceptual model to the relational model, normalise (typically to 3NF), define keys → output: logical schema of normalised tables.
5. **Physical design** — pick the DBMS, real tables with physical data types, indexes, storage plan → output: physical schema.
6. **Implement** — DDL, load data, set up security/access/performance.
7. **Test & validate** against the requirements, then deploy — and loop on feedback.

Tooling assumed: a diagramming tool, a DBMS, and a documentation repository.

## 2. Three levels of modeling

- **Conceptual** — highest abstraction. The main concepts (entities) and their relationships, understandable by non-technical stakeholders (domain experts, analysts, end users). Deliberately does **not** specify attributes in detail or primary keys. Purpose: agree on what the domain *is* before anyone decides how to store it.
- **Logical** — one step down, still technology-agnostic (no vendor, no DBMS). Adds attributes, primary keys, foreign keys, data types at an abstract level, and normalisation. Audience: database designers/developers. Purpose: a vendor-independent blueprint that physical design can be built from — and a shared language between developers and users.
- **Physical** — the DBMS-specific realisation: concrete types (e.g. conceptual TEXT becomes varchar(64)), indexes, storage.

Ways to express a model: SQL DDL, ER diagrams, UML, XML Schema, JSON Schema, tool-specific languages. UML class diagrams are often preferred for logical modeling.

**Scope rule:** a conceptual model contains exactly what the use cases need. Write the user stories first ("As an instructor, I want to post an assignment") — the stories are what tell you which classes, attributes and relationships exist, and when to stop modeling.

## 3. ER diagrams (Crow's Foot / Information Engineering notation)

Elements: rectangle = entity (becomes a table); oval = attribute (becomes a column); the connecting line = relationship. In the boxed style, an entity box has two compartments — name on top, attributes below.

**Attribute kinds:**
- *Simple* — a single value.
- *Composite* — splits into parts (a name → first / middle / last).
- *Multi-valued* — more than one value per entity; breaks 1NF, so it becomes its own entity in the logical model.
- *Derived* — computed from other data (e.g. GPA); store-vs-compute is an implementation decision, not a modeling fact.
- *Categorical* — a fixed value set (e.g. semester ∈ {Fall, Spring}); becomes a lookup table.
- A *weak entity* is identified only through a stronger entity's foreign key.

**Key taxonomy:**
- *Primary key* — unique, immutable, never null; often an auto-increment surrogate.
- *Surrogate key* — artificial, carries no business meaning.
- *Candidate key* — any attribute set that could serve as the PK; the ones not chosen are *alternate keys*.
- *Superkey* — any identifying set; the PK is a *minimal* superkey (superkeys are not drawn on an ERD).
- *Composite key* — a key of 2+ attributes.
- *Foreign key* — points at another entity's PK and enforces referential integrity; it is placed on the "many" side of a relationship.

**Relationship rules in Crow's Foot:** the only bounds are 0, 1, and many. A lower bound of 0 means optional participation. Relationships come in 1–1, 1–many, and many-to-many — and a many-to-many must be resolved (see §7).

## 4. UML class diagrams

UML is the OMG standard notation for system structure; the class diagram is its tool for static structure, and it doubles as a conceptual data-model / ontology notation (an alternative visual language to ERDs for the same job).

- A class is a three-compartment box: **name / attributes / operations**. For data/ontology modeling the operations compartment is usually dropped or reused for a glossary definition.
- Classes stand for concepts, things, roles, or events — the ERD's "entity".
- Attributes may carry a type and a default; the identifying attribute is tagged «key».
- Visibility marks: `+` public, `−` private, `#` protected.
- An *abstract* class («abstract» or italics) organises a hierarchy and cannot be instantiated; it needs at least two subclasses.

## 5. Relationship types in UML

Between object instances (these carry multiplicities):

- **Association** — a plain domain connection between two classes, neither dominant. Always read in both directions (associations are bidirectional); a small arrow in the *label* only shows which way the verb phrase reads — it is **not** a navigation arrow, and the line itself carries no arrowheads in a conceptual model. When unsure which relationship type fits, model an association — it can be refined later when more constraints are discovered.
- **Aggregation** — a special association: an anti-symmetric whole–part ("has-a") link where the part keeps its own identity and can exist without the whole. Aggregation inherits every property of association.
- **Composition** — the stronger form: the part cannot exist independently of the whole (a room cannot exist without its house); delete the whole and the parts go with it. Its label is usually omitted because it just means "contains / has-a".

Aggregation and composition are always anti-symmetric and transitive: if A contains B, B cannot contain A; if A contains B and B contains C, then A contains C. Recognisable patterns:

- *Assembly–parts* (aggregation) — a manufactured whole of identity-keeping parts (a car and its engine/wheels; the whole survives removing a part).
- *Container–content* (aggregation) — membership by rule, parts unrelated to each other (ads shown in a web page frame).
- *Organisation–member* (aggregation) — the organisation *is* its members, but members come and go (a team and its players; may carry a minimum-member rule).
- *Material–object* (composition) — materials lose their identity inside the object and cannot be removed (paper from wood fibre, cotton, glue). Analysis phrases: "is made from", "consists of".
- *Portion–ingredient* (composition) — parts are portions of the same kind as the whole (a slice of the pie; an inch of a foot).
- *Place–area* (composition) — nested same-kind containment (office ⊂ floor ⊂ building; city ⊂ county ⊂ state).
- *Collection–members* (composition) — parts permanently fused to the whole, with an ordering (a weekly timesheet of daily timesheets; a reservation of flight segments).

Between classes (no multiplicity, no label):

- **Generalisation** — an "is a kind of" taxonomy: the subclass inherits every attribute of the superclass and adds its own (Officer and Honorary Member are kinds of Member). Drawn with a hollow arrowhead from subclass to superclass. Implemented in code as inheritance.

Why bother distinguishing association/aggregation/composition if a relational database implements all three the same way? Because the distinctions are facts about the *domain* — constraints the model must express even when the storage layer cannot.

## 6. Multiplicity — the rules, and how to read them

Multiplicity is a domain constraint written as `<lower>..<upper>` at each end of an association, aggregation, or composition (never on generalisation):

- Lower bound is an integer ≥ 0; upper bound is an integer or `*` (unbounded); lower ≤ upper.
- Equal bounds collapse: 1..1 is written "1", 10..10 is "10".
- `*` alone implies a lower bound of 0 per the UML specification — but write 0..\* or 1..\* explicitly so the rule is visible.
- The upper bound can even be set by an attribute value (e.g. 1..[capacity]).
- Everyday readings: 0..1 = at most one, possibly none · 1..10 = at least one, at most ten · 5..\* = at least five, no limit.

**How to derive one:** classes are sets of instances, and a multiplicity is a mapping between the two sets. Take ONE instance of class A and ask "how many B's is it connected to?" — then take one B and ask the reverse. Both ends must be answered; the answers are business rules, so the same pair of classes can legitimately carry different multiplicities in different domains.

Worked reading (passengers and rides): a passenger takes 0..\* rides (some passengers never ride); a ride is taken by 1..2 passengers (at least one, at most two). Every clause of that sentence is one bound of one end.

## 7. From conceptual to logical: the translation procedure

1. Identify the entities (one per class).
2. Set primary keys — add a surrogate where no natural key qualifies.
3. Translate relationships and cardinality; the foreign key goes on the "many" side.
4. Handle the special relationships (below).
5. Convert multiplicities to Crow's Foot bounds (only 0, 1, many survive).
6. Review and normalise.
7. Document and validate with stakeholders.

Special cases:

- **Many-to-many → junction entity.** An M–M link becomes two 1–many links through a new associative (junction) entity. Its key can be the composite of the two foreign keys, or a surrogate of its own.
- **Generalisation → flatten + discriminator.** The hierarchy collapses into one entity with a "type" column naming the kind (in the module's worked example, kinds of sale end up as a SaleType lookup the Sale points to).
- **Aggregation / composition → plain participation.** At the logical level they are ordinary relationships; the whole–part strength is a conceptual-layer fact.
- **Categorical attribute → lookup table.** Fixed value sets become their own small entity.
- **Multi-valued attribute → own entity.** One row per value, linked back by foreign key.

Worked example used in the module (car sales): a Car is a kind of Vehicle; a Buyer buys a Car in a Sale. Buyer–Sale starts as many-to-many and resolves through a sales-transaction junction entity; "kind of vehicle/sale" becomes discriminator + lookup; every rule above fires exactly once — a good template for a teaching example.

## 8. The module's practice material (patterns worth reusing)

- **Facts → diagram:** given nine numbered facts about flight reservations (passengers, segments, crew composition with exact counts, airports, aircraft), draw the UML class diagram representing *only* what is stated — no invented facts. (Teaches: multiplicity from prose, composition for crew, «key» attributes.)
- **Diagram → facts:** given a finished class diagram, extract at least three facts/constraints it asserts, in sentences. (Teaches: reading multiplicities back into rules.)
- **Complete the diagram:** given facts about courses, lessons and instructors (including "no course has more than three instructors"), add the missing classes, attributes and relationship kinds. (Teaches: upper bounds other than \*, generalisation — "a demonstration is a kind of lesson".)
- **The ambiguity case (logical modeling short):** interview notes for a project-activity tracker deliberately contain traps — two stakeholders disagree on whether "tasks" and "activities" are the same thing (one says tasks are *composed of* activities), some activities are assigned to nobody (a participation rule waiting to be made mandatory), and "who else works on an activity" hides a many-to-many. The exercise: find the entities, attributes and relationships, and draw the ERD in Crow's Foot. (Teaches: modeling is reading comprehension + resolving contradictions, not drawing boxes.)

## 9. Transfer to our café dataset [Recommendation]

- The café chain's own schema story can follow §1's loop in miniature: requirements (what questions must the café data answer?) → conceptual sketch → the logical tables learners already meet in the SQL stage.
- §7's translation is the single most reusable procedure: it is exactly the bridge between "draw the domain" (advanced core, modeling at use depth per #89) and "build the tables" (SQL stage). The M–M → junction rule and categorical → lookup rule both fire naturally on café data (orders ↔ items; drink categories).
- Keep our standing visual rule (#58): stepped static diagrams for this material; no Venn diagrams for joins (unrelated, but the same diagram discipline).

## Sources (verified 2026-11-21)

1. **Chen, P. P.-S. (1976). "The Entity-Relationship Model — Toward a Unified View of Data." *ACM Transactions on Database Systems*, 1(1), 9–36.** DOI: https://doi.org/10.1145/320434.320440 — the original ER model paper; the primary source for entities, attributes, relationships as a design language (§§2–3, 7).
2. **Object Management Group. *Unified Modeling Language Specification*, Version 2.5.1 (formal, adopted December 2017).** https://www.omg.org/spec/UML/2.5.1/ — the standard itself: class diagrams, association/aggregation/composition semantics, and multiplicity (including the rule that a bare \* has lower bound 0) (§§4–6).
3. **Watt, A., & Eng, N. (2014). *Database Design – 2nd Edition*. BCcampus Open Education. Licensed CC BY 4.0.** https://opentextbc.ca/dbdesign01/ — an openly licensed textbook treatment aligned with this module: Ch. 4 "Types of Data Models" (conceptual/logical/physical), Ch. 5 "Data Modelling", Ch. 8 "The Entity Relationship Data Model", Ch. 10 "ER Modelling" (incl. Crow's Foot). CC BY 4.0 makes it the one source here whose text Data From Zero may adapt with attribution.

**Confidence:** high for the knowledge summary (read in full from the Owner's archive copies of all 8 lessons, 2026-11-21) and for the three sources (each opened and verified today). One honest gap: the many-to-many lesson in the archive is a video-only quick-take with no text; its content here is taken from the written ER lesson's treatment of the same rule, as the archive's own note directs.
