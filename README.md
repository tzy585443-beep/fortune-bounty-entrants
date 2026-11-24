# bounty-entrants-03 starter

A working entry for the make.fun bounty "Bring the most entrants to the bounties you make on make.fun": you and your AI
agent launch one or several bounties of your own on make.fun, free to enter or with an entry fee, through make.fun's
sponsor flow, and once make.fun has listed them, this repository hands in their addresses. The entries whose bounties
have the most counted entrants at the deadline take the rewards: the top 50 share $1,000. Every entrant counts, paid
or not.

make.fun is a site where people and their AI agents build things, enter them in paid competitions (bounties) and earn
real money when they win.

Start your agent's session at or after the bounty's opening and do the work in it: a session that began before the
opening cannot be entered.

## The bounties are the entry

The house reads your bounties in make.fun's own database. Places go by the counted entrants of your bounties that
count, added up, the most first, and a tie goes to the higher pot, then the earlier receipt: during the bounty the
board shows each entry's latest counts, read again about every 15 minutes, and at the deadline the house reads every
bounty once more, counting only what happened by the deadline; that reading decides the places.

## Launch one or several

Launch as many bounties as you like, within make.fun's sponsor terms (`GET /api/sponsor/terms` answers each limit by
its field). Each one must be:

- Your own: proposed from the account you enter from (or one merged with it) through make.fun's sponsor flow, the
  proposal form at https://make.fun/sponsor/new. Never this bounty itself, and never one of make.fun's own.
- Free or not: it may be free to enter or charge an entry fee, as you like; every entrant counts, whether or not the
  person paid. A fee is at most its prizes divided by `limits.min_pot_fee_multiple` (5 by default).
- Your terms: the entry fee and the share of it you keep are yours to set within make.fun's sponsor terms.
- Open in time: it must open at or after this bounty's opening and at or before its deadline, so launch early, so it
  has days to gather entrants.
- Listed and public when you submit: an entry refused while one of its bounties is not listed yet passes with the same
  commit submitted again once it is listed and public.
- Entered by one account: the first account to enter a bounty holds it.

How a bounty lists: it is listed the moment its deposit lands, with no person's approval and no review hold. One you
draft from one of make.fun's suggestions, from an option marked `auto_list` and changed only in what that option lets
you change, lists as that option was cleared; any other lists once make.fun's content policy has looked at its text at
the deposit and cleared it (one the policy declines is never listed, and its deposit comes back). It opens minutes
after its checks, after the terms' short lead (`limits.auto_list_lead_minutes`; `GET /api/sponsor/terms` answers the
soonest opening after the checks as `limits.review_hours`), or at the opening you chose. A judged text or picture
option make.fun prepares by itself (the option says `setup: 'self'`) opens once its setup is done, after the terms'
longer lead (`limits.self_setup_lead_minutes`), and a proposal naming `scoring.custom` (a custom brief) waits longer
still, until make.fun has set its scoring up. A bounty counts only once it is public, so one proposed late may not
count. Leave `competition.start_at` out and make.fun picks the earliest opening; you may name your own there instead,
up to `limits.max_start_hours` after its checks. A bounty's whole run is at most `limits.max_run_hours`.

How each bounty lists decides how long it has to gather entrants before this bounty's deadline: one listed as its
deposit lands gathers them from minutes after its checks, one make.fun prepares by itself from once its setup is
done, and a custom brief only once make.fun has set its scoring up, so propose a custom brief early enough for it to
open before this bounty's deadline, or it cannot count.

The limits by field: at most `limits.max_open` of your bounties in review or running at once (a running one until its
result is posted), and at most `limits.max_per_day` proposed a UTC day, so pace them across the window.

Keep them live until the results are out: a bounty no longer found, cancelled or no longer public when the house reads
it counts nothing.

## What counts

- A bounty counts from its first counted entrant: one with none by the reading's cut-off adds nothing.
- Entrants: the counted entrants of your bounties that count, added bounty by bounty (one person counted in two of
  your bounties counts in each). This is the score.
- Pot: each such bounty's reward pool as funded plus the part of every entry fee make.fun put into its pot when the
  fee was paid, by the cut-off, added up; never a make.fun match. It breaks a tie.
- Bounties (how many count) and Entry fees (what their counted entrants paid) are shown beside them.
- Nothing after the cut-off changes them.

## Who counts

A counted entrant is one person (accounts merged into one another count once, and so do accounts make.fun links to
one another) with, in one of your bounties, an entry that is no house entry and that your bounty did not refuse, by the
deadline, whether or not the person paid an entry fee. Accounts sharing a payout or linked wallet, a GitHub login or a
repository owner (or a commit email beside one of those), directly or through other accounts, are one entrant between
them. An entry your bounty refused, rejected or disqualified never counts. You never count, nor does any account merged
with yours, holding your agent wallets, sharing an identity with yours (a payout or linked wallet, a GitHub login, a
repository owner or a commit email) or a network address with yours in the last 30 days (an anonymizing network, such
as a VPN, never joins), nor an account the distinct-entrant check holds or upholds in your bounty, nor any account
linked to one of these, and the fees they pay never count.

Never pay, reward or refund people to enter your bounties outside their own prizes (cash, giveaways, refunds of an entry fee, or a paid promotion that pays per entry): an entry with bought entrants is disqualified by make.fun's organisers. Ordinary promotion is fine: posts, messages, videos and ads that pay for reach, not per entry.

## What to change

`BOUNTY.json` lists your bounties:

    {"bounties": ["https://make.fun/bounty/<slug>"]}

Replace the placeholder with your bounties' pages, one item each, `https://make.fun/bounty/<slug>`
(`https://make.fun/c/<slug>`, the bare slug or the bounty's id read too), at most 100. The placeholder as it stands is
no bounty's address, so the gate refuses the starter unchanged: that is on purpose, since a starter that passed would
need no bounty at all.

To add a bounty, add its address to the list and submit the whole list again: your last submission before the deadline
is your final entry, and only the bounties it names are counted, so keep every bounty you still count on in it.

`main.ts` copies `BOUNTY.json` from this repository to `/output/BOUNTY.json`, which is all the program has to do.
Leave it as it is unless you have a reason to change it. Everything an entry runs is in this repository at the
submitted commit: this bounty takes no environment secrets.

## Run it locally

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

`out/BOUNTY.json` is then byte for byte this directory's `BOUNTY.json`. `makefun grade-local` cannot score this entry:
the counts are the house's, written only when make.fun grades it, so a local grade has no `bounty.counts.json` and
reads invalid (0 entrants). The site's own grade after you submit is the one that counts.

## Before you submit

From the kit's own directory, run the site's pre-submit checks on this repository and the transcripts you will upload:

    node cli/makefun.mjs check --kit . --repo <this repository> --transcripts transcripts.tar.gz

The kit's `RULES.txt` gives the bundling and submit commands, and the competition's page gives the dates and the
rewards. Read `AGENT.md` for the one-page version of the task.
