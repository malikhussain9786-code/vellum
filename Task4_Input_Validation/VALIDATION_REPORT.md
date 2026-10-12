# Task 4 — Input Validation Report (Vellum)

All rules are implemented in **`src/lib/validation.js`** (copy included here) and wired into every form.
Errors appear under each field after the user leaves it (or when Submit is pressed), are announced to
screen readers (`role="alert"`, `aria-invalid`), and every form uses `noValidate` so the app's own messages
show instead of the browser's default bubbles. The auth layer (`AuthContext.jsx`) re-validates before saving,
so bypassing the UI does not bypass the rules.

## Account & contact forms

| Form | Field | Rules |
|---|---|---|
| Sign Up | Name | Required, 2–50 chars, letters/spaces/`'`/`.`/`-` only (no digits) |
| Sign Up | Email | Required, valid format, no spaces, no `..`, max 254 |
| Sign Up | Password | Required, 8–64 chars, ≥1 uppercase, ≥1 lowercase, ≥1 number, no spaces |
| Sign Up | Confirm password | Required, must match password |
| Sign In | Email | Required, valid format |
| Sign In | Password | Required (strength is *not* revealed for existing accounts) |
| Forgot Password | Email / New password / Confirm | Same rules as Sign Up |
| Profile | Full name | Same as Name |
| Profile | Current / New / Confirm password | Current required; new follows password rules, must differ from current, must match confirm |
| Contact Us | Name | Required, same as Name |
| Contact Us | Email | Required, valid format |
| Contact Us | Phone *(optional)* | Digits, spaces, `+ ( ) - .` only; 7–15 digits |
| Contact Us | Subject | Required, 3–100 chars, no `<` `>` |
| Contact Us | Message | Required, 10–1000 chars, live character counter, no `<` `>` |

## Resume Builder (every input)

| Section | Field | Rules |
|---|---|---|
| Personal | Photo | JPG/PNG/WebP only, ≤ 5 MB, non-empty |
| Personal | Full name | Required, name rules |
| Personal | Title, Location | ≤ 80 chars |
| Personal | Email | Valid format (optional) |
| Personal | Phone | Phone rules (optional) |
| Personal | LinkedIn | Valid link on `linkedin.com` (optional) |
| Personal | Portfolio | Valid link (optional); blocks `javascript:` etc. |
| Summary | Summary | ≤ 600 chars, counter |
| Experience | Job title, Company | Required, ≤ 100 |
| Experience | Location | ≤ 80 |
| Experience | Start / End | `2022`, `06/2022` or `Jun 2022`; year 1950–(now+10); end ≥ start; end ignored when "currently work here" |
| Experience | Achievements | ≤ 200 chars each |
| Education | Degree, School | Required, ≤ 100 |
| Education | Start / End / Notes | Date rules; end ≥ start; notes ≤ 200 |
| Projects | Name | Required, ≤ 100 |
| Projects | Description | ≤ 400, counter |
| Projects | Link | Valid link (optional) |
| Skills / Technologies | Tags | ≤ 40 chars each, max 30, no duplicates, no `<` `>` |
| Certificates | Name (required), Org, Date | ≤ 100 / ≤ 100 / date rules |
| Awards, Publications | Title (required), Org/Publisher, Date | ≤ 100 / ≤ 100 / date rules |
| Volunteer | Role (required), Org, Date, Description | ≤ 100 / ≤ 100 / date or range like `2020 — Present` / ≤ 400 |
| Custom sections | Section title (required), line items | ≤ 60 / ≤ 200 |
| Resume title (builder + dashboard rename) | Title | Required (not saved empty), ≤ 60 |

## How it was tested

* `npm test` → `tests/validation.test.mjs` (see `test_output.txt`): about 70 assertions on valid and invalid inputs.
* Browser test (headless Chrome): empty submits, bad values, valid sign-up, wrong-password sign-in,
  contact message saved, builder email/phone/LinkedIn errors. Screenshots are in this folder.
