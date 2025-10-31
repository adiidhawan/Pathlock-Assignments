#!/usr/bin/env bash
# check-api.sh — loud mode: prints all responses
# Usage: ./check-api.sh [BASE_URL]
# Example: ./check-api.sh http://localhost:5097

set -euo pipefail

BASE_URL="${1:-http://localhost:5097}"
API_BASE="$BASE_URL/api/tasks"

divider="--------------------------------------------------------"

echo
echo "🔍 Testing TaskManager API at: $API_BASE"
echo "$divider"

# helper to print request and response
call_api() {
  local METHOD=$1
  local URL=$2
  local BODY=${3:-}
  echo
  echo "➡️  $METHOD $URL"
  if [ -n "$BODY" ]; then
    echo "📤 Request body:"
    echo "$BODY"
  fi

  if [ -n "$BODY" ]; then
    RESP=$(curl -s -w "\n%{http_code}" -X "$METHOD" "$URL" \
      -H "Content-Type: application/json" \
      -d "$BODY")
  else
    RESP=$(curl -s -w "\n%{http_code}" -X "$METHOD" "$URL")
  fi

  STATUS=$(echo "$RESP" | tail -n1)
  BODY_RESP=$(echo "$RESP" | sed '$d')

  echo "📥 Response status: $STATUS"
  echo "📦 Response body:"
  echo "$BODY_RESP"
  echo "$divider"

  # store globally for next steps
  LAST_STATUS=$STATUS
  LAST_BODY=$BODY_RESP
}

# 1) GET all tasks
call_api "GET" "$API_BASE"

# 2) POST create a new task
DESC="shell-test-$(date +%s)"
PAYLOAD="{\"description\":\"$DESC\",\"isCompleted\":false}"
call_api "POST" "$API_BASE" "$PAYLOAD"

# extract id
ID=$(echo "$LAST_BODY" | grep -oE '"id":"[^"]+"' | head -n1 | cut -d'"' -f4)
if [ -z "$ID" ]; then
  ID=$(echo "$LAST_BODY" | grep -oE '"Id":"[^"]+"' | head -n1 | cut -d'"' -f4)
fi

if [ -z "$ID" ]; then
  echo "❌ Could not extract task id from response."
  exit 1
fi
echo "✅ Created task id: $ID"

# 3) GET by id
call_api "GET" "$API_BASE/$ID"

# 4) PUT update (toggle)
PAYLOAD="{\"isCompleted\":true}"
call_api "PUT" "$API_BASE/$ID" "$PAYLOAD"

# 5) DELETE
call_api "DELETE" "$API_BASE/$ID"

# 6) Verify deletion (should 404)
call_api "GET" "$API_BASE/$ID"

echo "✅ API test sequence complete."
echo "$divider"
