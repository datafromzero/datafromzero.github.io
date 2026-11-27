---
title: "Advanced core: all lessons"
description: Every advanced core lesson (statistics, Git, data modeling, cloud basics and AI) in the order to study them, with your done ticks, and a placement test for Part 1.
---

## Placement test

New to statistics? Skip this test and start at [*Data types, units and how data was collected*](/core/study-design-and-data-types/) (C1); that is normal.

The advanced core has six parts. This test covers Part 1, *Statistics I* (C1 to C7), because every later part leans on it. Parts 2 to 6 open with their own "Can you skip Part N?" test (in C8, C16, C22, C30 and C36), so no one test has to cover all 44 lessons. Each of those tests says which lessons of its part it checks, and passing does not skip the others. Try these seven questions without looking anything up. Each answer is in the box under its question. The numbers come from the cafe-sales data: 1,800 orders, one of them canceled; the completed orders total 22,749.25 dollars. Order totals use the completed orders. Counts of customers use every order that has a customer id, whatever its status.

This test covers C1, C2, C3, C4, C5, C6 and C7, all seven lessons of Part 1.

<div hidden data-placement-test="core-1" data-covers="C1 C2 C3 C4 C5 C6 C7"></div>

- **All seven right:** you can skip Part 1. Go to [*Hypothesis tests and p-values, honestly*](/core/hypothesis-testing/) (C8). It starts Part 2 and opens with its own "Can you skip Part 2?" test; the later parts do the same.
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study Part 1 from there, in order.

1. `order_items.csv` has 3,287 rows. A teammate writes: "3,287 people bought something in six months." Give two reasons why this sentence is wrong.

   <details>
   <summary>Answer</summary>

   One row is one product line inside an order, not a person. (1) Several lines share an order: 1,800 orders took 3,287 lines. (2) One customer places many orders: every order that has a customer id (all but the walk-in order) comes from one of only 145 different customers.

   *Why:* first say what one row stands for; the counting follows from it.

   Missed it? Study [*Data types, units and how data was collected*](/core/study-design-and-data-types/) (C1).

   </details>

2. The completed order totals have a mean of 12.65 dollars, a median of 11.75, an interquartile range (IQR) of 9.50 and a standard deviation of 8.62. The largest order costs 197.00 dollars. You remove that one order. Which of the four numbers stay the same here, and which change?

   <details>
   <summary>Answer</summary>

   The median stays 11.75 and the IQR stays 9.50. The mean falls a little, from 12.65 to 12.54. The standard deviation falls a lot, from 8.62 to 7.44.

   *Why:* the mean and the standard deviation use the size of every value, so the biggest one pulls on them. The median and the quartiles are read from places in the sorted list, and removing one value moves each cut point by less than one place in the list. Here many orders share the same total (16 orders cost exactly 11.75, 38 cost exactly 7.00 and 19 cost exactly 16.50, where the median and the two quartiles sit), so the value at the new place is the same. With other data they could move a little, but never by how large the removed value was.

   Missed it? Study [*Center and spread: mean, median and standard deviation*](/core/center-and-spread/) (C2).

   </details>

3. With the same mean, 12.65, and standard deviation, 8.62: a completed order costs 30.00 dollars. (a) What is its z-score? (b) Is that a reason to delete the order from the data?

   <details>
   <summary>Answer</summary>

   (a) (30.00 − 12.65) ÷ 8.62 = 2.01, about 2 standard deviations above the mean. (b) No. A z-score of 2 is unusual, not impossible: 58 of the 1,799 orders (3.2 percent) cost more than 30.00. Order totals have a long tail on the right, so the "about 2.5 percent above z = 2" of a bell curve is only a guide. Delete an order only when you find evidence that it is an error.

   *Why:* a z-score says how far a value is from the mean in standard deviations; it does not say why.

   Missed it? Study [*Distributions, z-scores and outliers*](/core/distributions-and-outliers/) (C3).

   </details>

4. These are the 1,799 completed orders by store and payment method. (a) What is P(card given Harbor)? (b) What is P(Harbor given card)? Round to whole percents. Why are they not equal?

   | store | card | mobile | cash | all |
   |---|---:|---:|---:|---:|
   | Old Town | 421 | 217 | 91 | 729 |
   | Campus | 400 | 209 | 106 | 715 |
   | Harbor | 180 | 120 | 55 | 355 |
   | all | 1,001 | 546 | 252 | 1,799 |

   <details>
   <summary>Answer</summary>

   (a) 180 ÷ 355 = 51 percent. (b) 180 ÷ 1,001 = 18 percent. They answer two different questions: the first looks only at Harbor orders and asks how many were paid by card; the second looks only at card orders and asks how many were taken at Harbor. The two groups have different sizes.

   *Why:* "A given B" restricts the data to B first, so swapping the two changes the denominator.

   Missed it? Study [*Probability, conditional probability and base rates*](/core/probability-and-base-rates/) (C4).

   </details>

5. The owner asks: "How many orders does a customer place, on average?", and means all 150 customers in the customers table. A report answers: "The data shows 12.4 orders per customer." It divides the 1,799 orders that have a customer id by the 145 different customer ids found in the orders table. Does the 12.4 answer the owner's question? What number does?

   <details>
   <summary>Answer</summary>

   No. The orders table only holds customers who ordered. Five of the 150 customers never ordered, so they are missing from the 145, and the data was cut by the very thing you are measuring. For all 150 customers the average is 1,799 ÷ 150 = 12.0 orders. The 12.4 is right for a different question: orders per customer who ordered at least once.

   *Why:* say who is in the group before you divide, and ask who could not appear in the data.

   Missed it? Study [*Samples and the ways they mislead*](/core/sampling-and-bias/) (C5).

   </details>

6. The standard deviation of the order totals is 8.62 dollars. You draw a random sample of 100 orders, each draw picking any of the orders again (with replacement, so the draws are independent), and take its mean. (a) What is the standard error of that mean? (b) What is it with a random sample of 400 orders?

   <details>
   <summary>Answer</summary>

   The standard error is the standard deviation divided by the square root of the sample size. (a) 8.62 ÷ 10 = 0.86 dollars. (b) 8.62 ÷ 20 = 0.43 dollars. Four times the orders halve the standard error.

   If you drew 400 different orders out of only these 1,799, without putting any back, the sample would be 22 percent of them, and the standard error would be a little smaller, about 0.38 (about 0.84 for 100 orders). The lesson on sampling variability shows the same effect with 480 orders.

   *Why:* the standard deviation says how orders vary; the standard error says how a sample mean varies, and it shrinks as the sample grows.

   Missed it? Study [*Sampling variability and the Central Limit Theorem*](/core/sampling-variability-clt/) (C6).

   </details>

7. Of the 1,799 completed orders, 1,001 were paid by card: 55.6 percent. Treat the orders as a random sample. Which is closest to the margin of error of a 95 percent confidence interval for that share: (a) 0.1 points, (b) 2.3 points, or (c) 10 points?

   <details>
   <summary>Answer</summary>

   (b). The standard error of a share is the square root of (0.556 × 0.444 ÷ 1,799), which is 0.0117. Multiply by 1.96 to get 0.023, or 2.3 points: the interval runs from about 53.3 to 57.9 percent.

   *Why:* the margin of a 95 percent interval is about two standard errors, and a share from this many orders is known to within a few points.

   Missed it? Study [*Confidence intervals*](/core/confidence-intervals/) (C7).

   </details>
