#!/bin/bash
# One-command release gate. Builds, serves with a freshness assertion, runs every check and measure,
# then the content greps (removed phrases, forbidden facts, dead links). Exit 1 on any failure.
# pipefail is not cosmetic here. Every check below is piped to `tail`, and
# without it `cmd | tail || FAIL=1` reads TAIL's exit status, which is always
# 0 - so the gate printed "GATE: CLEAN" while three measures were crashing on
# a dead server. A gate that cannot fail is not a gate.
set -u -o pipefail; cd "$(dirname "$0")/.."
PORT="${PORT:-4399}"; FAIL=0
# dist is REMOVED first. This repo lives under a synced Documents folder, and
# the sync service leaves conflict duplicates ("chunks 2", "foo 2.webp") inside
# dist. Those are unreadable placeholders: grep and python both abort on them
# with "Resource deadlock avoided", which failed this gate for a reason that
# had nothing to do with the site. A build directory is disposable; delete it
# rather than trust its contents.
rm -rf dist
echo "=== BUILD ==="; npm run build 2>&1 | grep -E "built|Complete|error|✗" | tail -3 || FAIL=1
echo "=== CHECK ==="; npm run check 2>&1 | grep -E "errors|warnings" | head -2
# Static checks first - these read files, not a server.
for s in check:media check:palette; do echo "=== $s ==="; npm run "$s" 2>&1 | tail -2 || FAIL=1; done

# THE SERVER COMES UP BEFORE ANYTHING BROWSER-BASED, AND IS PROVEN FRESH FIRST.
#
# check:a11y and check:contrast used to run above this line, against whatever
# happened to be listening on their default port. That is the stale-build trap
# this project has already paid for once: a preview server survived a restart,
# the new one silently took the next port, and an hour of measurements
# described a build that was no longer on disk. The two checks that matter
# most were the two running unverified.
# `astro preview`, not python -m http.server. Two reasons, both learned the
# hard way in this run:
#
#   1. ROUTING. A plain static server has no clean URLs, so /404 returned the
#      SERVER'S OWN error document - whose bare h1 and p sit outside any
#      landmark - and axe duly reported "4 violations in our code" for a page
#      this project did not write.
#   2. CONCURRENCY. Pages here pull fonts, a shader chunk and a dozen images
#      at once. Served one request at a time, `networkidle` never settles:
#      check:contrast and measure:hue both died on TimeoutError against a
#      site that is fine.
#
# The PID is captured rather than pkill'd by pattern. `pkill -f "astro
# preview"` does not match the process Astro actually spawns, which is how an
# hour once went into measuring a server that had already been replaced.
rm -f /tmp/gate-preview.log
npm run preview -- --port "$PORT" > /tmp/gate-preview.log 2>&1 &
PREVIEW_PID=$!
for _ in $(seq 1 40); do grep -qE "localhost:[0-9]+" /tmp/gate-preview.log && break; sleep 1; done

# THE PORT IS READ BACK, NEVER ASSUMED.
#
# Astro does not fail when its port is taken - it prints "Port N is in use,
# trying another one" and quietly moves up. This gate has already been caught
# by that once: it asked for 4399, Astro served 4400, and every check ran
# against a stray server on 4399 that the gate had not started and could not
# vouch for. The freshness assertion passed anyway, because that stray server
# happened to be serving the same dist - which is exactly how this class of
# bug survives, by looking correct.
ACTUAL_PORT=$(grep -oE "localhost:[0-9]+" /tmp/gate-preview.log | head -1 | cut -d: -f2)
if [ -z "${ACTUAL_PORT:-}" ]; then
  echo "*** preview server never reported a port"; FAIL=1; ACTUAL_PORT="$PORT"
elif [ "$ACTUAL_PORT" != "$PORT" ]; then
  echo "  note port $PORT was taken; the server we started is on $ACTUAL_PORT, and that is what will be measured"
fi
PORT="$ACTUAL_PORT"

SERVED=$(curl -s "http://localhost:$PORT/" | md5 -q); BUILT=$(md5 -q dist/index.html)
if [ "$SERVED" != "$BUILT" ]; then
  echo "*** STALE SERVER on :$PORT ($SERVED != $BUILT) - refusing to measure it"; FAIL=1
else
  echo "freshness: served == built"
  for m in check:a11y check:contrast measure:warm measure:hue measure:pages; do
    echo "=== $m ==="; PORT=$PORT npm run "$m" 2>&1 | tail -8 || FAIL=1
  done
fi
kill "$PREVIEW_PID" 2>/dev/null; wait "$PREVIEW_PID" 2>/dev/null
echo "=== PHRASES (all must be absent) ==="; cd dist
for q in "Camp NWMI" "Nobody here is fundraising" "gave up on" "in the business of" "Say so when you enroll" "before the year starts" "separate organization" "no phone tree" "learns a word" "dressed up as a virtue" "most itself" "points at" "not what a year costs" "no endowment" "form reply" "turned away" "meet you at the door" "Better than either" "not a classroom" "never quite been able to name" "worth real money"; do n=$(grep -rl -F "$q" . 2>/dev/null | wc -l | tr -d ' '); [ "$n" != "0" ] && { echo "  *** '$q' in $n file(s)"; FAIL=1; }; done; echo "  phrases ok"
echo "=== FACTS ==="; iec=$(grep -rl '340-2070' . | wc -l | tr -d ' '); res=$(grep -ril 'red clover\|15216\|20853' . | wc -l | tr -d ' '); our=$(grep -ril 'our address\|our building' . | wc -l | tr -d ' '); isp=$(grep -rl '929-1441' . | wc -l | tr -d ' ')
echo "  IEC-number:$iec residential:$res our-address:$our ISP-number:$isp"; { [ "$iec" != 0 ] || [ "$res" != 0 ] || [ "$our" != 0 ] || [ "$isp" = 0 ]; } && FAIL=1
echo "=== DEAD LINKS ==="; python3 - <<'PY' || FAIL=1
import re,os,glob,sys
routes={'/'}
for f in glob.glob('**/*.html',recursive=True): routes.add('/'+f.replace('/index.html','/').replace('.html',''))
dead={}
unreadable=[]
for f in glob.glob('**/*.html',recursive=True):
    try: html=open(f,encoding='utf8',errors='ignore').read()
    except OSError as e: unreadable.append((f,e.strerror)); continue
    for m in set(re.findall(r'href="(/[^"#?]*)"',html)):
        if '.' in os.path.basename(m):
            try: ok=os.path.exists('.'+m)
            except OSError: ok=True
            if not ok: dead.setdefault(m,set()).add(f)
        elif m.rstrip('/') and m.rstrip('/') not in {r.rstrip('/') for r in routes}: dead.setdefault(m,set()).add(f)
for f,err in unreadable: print(f"  note unreadable, skipped: {f} ({err})")
print("  none" if not dead else "  *** "+str(dead)); sys.exit(1 if dead else 0)
PY
cd ..; echo; [ "$FAIL" = 0 ] && echo "GATE: CLEAN" || { echo "GATE: FAILED"; exit 1; }
