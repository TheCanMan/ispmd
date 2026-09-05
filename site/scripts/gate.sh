#!/bin/bash
# One-command release gate. Builds, serves with a freshness assertion, runs every check and measure,
# then the content greps (removed phrases, forbidden facts, dead links). Exit 1 on any failure.
set -u; cd "$(dirname "$0")/.."
PORT="${PORT:-4399}"; FAIL=0
echo "=== BUILD ==="; npm run build 2>&1 | grep -E "built|Complete|error|✗" | tail -3 || FAIL=1
echo "=== CHECK ==="; npm run check 2>&1 | grep -E "errors|warnings" | head -2
for s in check:media check:palette; do echo "=== $s ==="; npm run "$s" 2>&1 | tail -2 || FAIL=1; done
echo "=== check:a11y ==="; npm run check:a11y 2>&1 | tail -3 || FAIL=1
echo "=== check:contrast ==="; npm run check:contrast 2>&1 | tail -3 || FAIL=1
pkill -f "http.server $PORT" 2>/dev/null; (cd dist && python3 -m http.server "$PORT" >/dev/null 2>&1 &); sleep 2
SERVED=$(curl -s "http://localhost:$PORT/" | md5 -q); BUILT=$(md5 -q dist/index.html)
if [ "$SERVED" != "$BUILT" ]; then echo "*** STALE SERVER on :$PORT ($SERVED != $BUILT)"; FAIL=1; else echo "freshness: served == built"; fi
for m in measure:warm measure:hue; do echo "=== $m ==="; PORT=$PORT npm run "$m" 2>&1 | tail -8 || FAIL=1; done
pkill -f "http.server $PORT" 2>/dev/null
echo "=== PHRASES (all must be absent) ==="; cd dist
for q in "Camp NWMI" "Nobody here is fundraising" "gave up on" "in the business of" "Say so when you enroll" "before the year starts" "separate organization" "no phone tree" "learns a word" "dressed up as a virtue" "most itself" "points at" "not what a year costs" "no endowment" "form reply" "turned away" "meet you at the door" "Better than either" "not a classroom" "never quite been able to name" "worth real money"; do n=$(grep -rl -F "$q" . 2>/dev/null | wc -l | tr -d ' '); [ "$n" != "0" ] && { echo "  *** '$q' in $n file(s)"; FAIL=1; }; done; echo "  phrases ok"
echo "=== FACTS ==="; iec=$(grep -rl '340-2070' . | wc -l | tr -d ' '); res=$(grep -ril 'red clover\|15216\|20853' . | wc -l | tr -d ' '); our=$(grep -ril 'our address\|our building' . | wc -l | tr -d ' '); isp=$(grep -rl '929-1441' . | wc -l | tr -d ' ')
echo "  IEC-number:$iec residential:$res our-address:$our ISP-number:$isp"; { [ "$iec" != 0 ] || [ "$res" != 0 ] || [ "$our" != 0 ] || [ "$isp" = 0 ]; } && FAIL=1
echo "=== DEAD LINKS ==="; python3 - <<'PY' || FAIL=1
import re,os,glob,sys
routes={'/'}
for f in glob.glob('**/*.html',recursive=True): routes.add('/'+f.replace('/index.html','/').replace('.html',''))
dead={}
for f in glob.glob('**/*.html',recursive=True):
    for m in set(re.findall(r'href="(/[^"#?]*)"',open(f,encoding='utf8',errors='ignore').read())):
        if '.' in os.path.basename(m):
            if not os.path.exists('.'+m): dead.setdefault(m,set()).add(f)
        elif m.rstrip('/') and m.rstrip('/') not in {r.rstrip('/') for r in routes}: dead.setdefault(m,set()).add(f)
print("  none" if not dead else "  *** "+str(dead)); sys.exit(1 if dead else 0)
PY
cd ..; echo; [ "$FAIL" = 0 ] && echo "GATE: CLEAN" || { echo "GATE: FAILED"; exit 1; }
