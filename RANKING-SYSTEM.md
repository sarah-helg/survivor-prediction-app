# Survivor Prediction App - Ranking System Documentation

## ✅ CORRECTED & VERIFIED - Consistent Throughout App

### The Ranking System

**Position 1** = **Winner** (Sole Survivor) 🏆
**Position 2** = Runner-up
**Position 3** = 3rd Place
**Positions 4-23** = Elimination order (4 = 21st out, 23 = 2nd out)
**Position 24** = **First person eliminated**

**Lower numbers = Better placement**

---

## 🐛 Bug Fixed (2025-02-07)

### Issue Found
The scoring algorithm had the Final 3 calculation backwards:
- **Old (buggy):** `finalRank >= totalContestants - 2` (checked positions 22-24)
- **New (fixed):** `finalRank <= 3` (checks positions 1-3)

### Files Fixed
1. `/app/api/admin/eliminate/route.ts` - Final 3 scoring bonus logic
2. `/components/admin-panel.tsx` - Dropdown labels and help text

---

## 📊 Scoring System

### Points Breakdown
- **Exact match** (0 positions off): **5 points**
- **One off** (±1 position): **3 points**
- **Two off** (±2 positions): **1 point**
- **Final 3 bonus**: **+5 points** (if contestant finishes in positions 1-3 AND you predicted them in 1-3)

### Maximum Points Per Contestant
- Exact match + Final 3 bonus: **10 points** (predicted #1, actual #1)
- Exact match only: **5 points** (predicted #15, actual #15)
- One off + Final 3 bonus: **8 points** (predicted #2, actual #3)

### Examples

**Example 1: Winner Predicted Correctly**
- Prediction: Position #1
- Actual: Position #1 (Winner)
- Points: **10** (5 exact + 5 Final 3 bonus)

**Example 2: Close Final 3 Prediction**
- Prediction: Position #2
- Actual: Position #3 (3rd place)
- Points: **8** (3 one-off + 5 Final 3 bonus)

**Example 3: Mid-Season Elimination**
- Prediction: Position #12
- Actual: Position #14
- Points: **1** (two off, no bonus)

**Example 4: Way Off**
- Prediction: Position #5
- Actual: Position #20
- Points: **0** (difference > 2)

---

## 🎯 Final 3 Bonus Rules

The Final 3 bonus (+5 points) is awarded when **BOTH** conditions are met:
1. Contestant finishes in positions **1, 2, or 3**
2. You predicted them in positions **1, 2, or 3**

**Note:** Both the actual rank AND your prediction must be in Final 3 to get the bonus.

### Final 3 Bonus Examples

✅ **Bonus Awarded:**
- Predicted #1, Actual #1 → 10 pts (5 exact + 5 bonus)
- Predicted #2, Actual #3 → 8 pts (3 one-off + 5 bonus)
- Predicted #3, Actual #1 → 6 pts (1 two-off + 5 bonus)

❌ **No Bonus:**
- Predicted #4, Actual #1 → 0 pts (difference too large, even though actual is Final 3)
- Predicted #1, Actual #5 → 0 pts (difference too large, even though prediction was Final 3)
- Predicted #10, Actual #12 → 1 pt (no Final 3 involvement)

---

## 📋 Files Using Ranking System

All files below correctly implement the system (Position 1 = Winner):

### User-Facing Pages
- `/app/rankings/page.tsx` - Predictions submission page
- `/app/leaderboard/page.tsx` - Player leaderboard
- `/app/admin/page.tsx` - Admin panel
- `/app/page.tsx` - Dashboard

### Components
- `/components/ranking-instructions.tsx` - Help text
- `/components/ranking-list.tsx` - Drag-and-drop predictions
- `/components/draggable-contestant.tsx` - Individual contestant cards
- `/components/contestant-card.tsx` - Contestant display
- `/components/admin-panel.tsx` - Admin controls
- `/components/scoring-rules.tsx` - Scoring explanation
- `/components/leaderboard-table.tsx` - Player standings
- `/components/leaderboard-podium.tsx` - Top 3 players

### API Routes
- `/app/api/admin/eliminate/route.ts` - Elimination & scoring
- `/app/api/rankings/route.ts` - Store predictions
- `/app/api/contestants/route.ts` - Get contestants
- `/app/api/leaderboard/route.ts` - Get scores

### Database
- `/lib/db.ts` - Type definitions
- `contestants.final_rank` - Stores 1-24 (1=winner, 24=first out)
- `rankings.predicted_position` - Stores 1-24 user predictions

---

## 🧪 Testing the System

Use the provided test scripts:

```bash
# Create test user with predictions
node scripts/test-scoring.js

# Check scores after eliminations
node scripts/check-scores.js

# Undo last elimination
node scripts/undo-elimination.js

# Clean up all test data
node scripts/cleanup-test.js
```

---

## ✅ System Consistency Verified

**Status:** All files use consistent ranking (Position 1 = Winner, Position 24 = First Out)

**Last Verified:** February 7, 2025
**Bug Fix Applied:** Final 3 scoring bonus now correctly checks positions 1-3

---

## 🎮 Quick Reference

| Position | Meaning | Final 3? |
|----------|---------|----------|
| 1 | Winner (Sole Survivor) | ✅ Yes |
| 2 | Runner-up | ✅ Yes |
| 3 | 3rd Place | ✅ Yes |
| 4-21 | Elimination order | ❌ No |
| 22 | 3rd person eliminated | ❌ No |
| 23 | 2nd person eliminated | ❌ No |
| 24 | First person eliminated | ❌ No |

**Remember:** Lower position number = Better placement!
