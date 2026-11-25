"""The held-out questions of the capstone, written for it (none is in lessons MLE9 or MLE10): 12 that the corpus answers, and 4 that it does not.

Each of the 12 is (question, lesson that holds the answer, phrases of that lesson that hold it, patterns an answer must match, all of them).
Each of the 4 is (question, kind): a `near` question is about SQL, and a `far` one is not. None of the four is answered by the corpus: the words
that would answer them (ALTER, concat, Canada, forest) appear in none of the eight lessons. Use these 16 once, at the end of your build.
"""

CAPSTONE = [
    ("Can an IS NULL test itself come out as NULL?", "null-handling", ["Both answer true or false, never NULL"], ["never|\\bno\\b|true or false"]),
    ("Is a missing value the same as an empty text?", "null-handling", ["NULL is not 0 or empty text"], ["\\bno\\b|not|different|neither"]),
    ("What is the grain of a query that groups orders by store?", "group-by-having", ["one row per store. That is the grain"], ["one row (per|for each|for every) store|per store|each store"]),
    ("What does DuckDB say when a selected column is not in the GROUP BY?", "group-by-having", ["must appear in the GROUP BY clause"], ["must appear in the GROUP BY"]),
    ("If a key appears 3 times on one side of a join and 2 times on the other, how many rows come out?", "inner-join", ["gives a × b rows"], ["\\b6\\b|3 ?[×x*] ?2|a ?[×x*] ?b"]),
    ("What does a CROSS JOIN return?", "inner-join", ["Every possible pair is what a CROSS JOIN returns"], ["every (possible )?pair|every row with every row|all (possible )?pairs"]),
    ("What do SEMI JOIN and ANTI JOIN return in DuckDB?", "left-join-anti-join", ["ANTI JOIN gives the left rows with no match, and SEMI JOIN the left rows with at least one"], ["at least one", "no match"]),
    ("How does an anti join differ from NOT IN when the right table holds a NULL?", "left-join-anti-join", ["it ignores NULL values from the right table"], ["ignore"]),
    ("Which rows does a window function read when OVER has no ORDER BY?", "window-functions", ["No ORDER BY in OVER: the frame is the whole block"], ["whole|entire|all (the )?rows"]),
    ("What are the rows tied with the current row called in a window frame?", "window-functions", ["its peers"], ["peers"]),
    ("How does DuckDB's documentation describe a regular CTE?", "ctes", ["essentially a view (a saved query) limited in scope to one query"], ["view"]),
    ("What does the function last_day give?", "dates-and-time", ["last_day(x) gives the last day of the month of x"], ["last day of the month"]),
]
TRAPS = [
    ("How do I add a column to an existing table?", "near"),
    ("How do I concatenate two text columns?", "near"),
    ("How many people live in Canada?", "far"),
    ("How do I train a random forest?", "far"),
]
