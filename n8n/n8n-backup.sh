#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define the workflows directory using the script's directory
WORKFLOWS_DIR="$SCRIPT_DIR/workflows"

# Source the environment variables from the .env file in the script's directory
source "$SCRIPT_DIR/.env"

# Check if required environment variables are set and valid
if [ -z "$X_N8N_API_KEY" ]; then
  echo "Error: X_N8N_API_KEY is not set in the environment variables."
  exit 1
fi

if [ "$X_N8N_API_KEY" == "changeme" ]; then
  echo "Error: X_N8N_API_KEY is still set to 'changeme'. Please update it in the .env file."
  exit 1
fi

if [ -z "$N8N_BASE_URL" ]; then
  echo "Error: N8N_BASE_URL is not set in the environment variables."
  exit 1
fi

# Set default pagination count from .env or use a default value if not set
LIMIT=${N8N_PAGINATION_LIMIT:-150}

# Create the workflows directory if it doesn't exist
mkdir -p "$WORKFLOWS_DIR"

# Initialize the cursor for pagination
cursor=""

while true; do
  # Construct the API URL with pagination parameters
  if [ -z "$cursor" ]; then
    api_url="$N8N_BASE_URL?limit=$LIMIT"
  else
    api_url="$N8N_BASE_URL?limit=$LIMIT&cursor=$cursor"
  fi

  # Fetch the workflows using the n8n API
  response=$(curl -s -H "X-N8N-API-KEY: $X_N8N_API_KEY" "$api_url")
  echo $response

  # Process the workflows from the response
  echo "$response" | jq -c '.data[]' | while read -r workflow; do
    id=$(echo "$workflow" | jq -r '.id')
    name=$(echo "$workflow" | jq -r '.name' | sed 's/ /_/g') # Replace spaces with underscores in the workflow name
    nodes_count=$(echo "$workflow" | jq -r '.nodes | length')
    updated_at=$(echo "$workflow" | jq -r '.updatedAt')
    version_id=$(echo "$workflow" | jq -r '.versionId')
    tags=$(echo "$workflow" | jq -r '.tags | join(", ")')

    # Create the subdirectory for the workflow if it doesn't exist
    WORKFLOW_DIR="$WORKFLOWS_DIR/$id"
    mkdir -p "$WORKFLOW_DIR"

    # Determine the latest backup file
    latest_backup=$(ls -t "$WORKFLOW_DIR"/backup-*.json 2>/dev/null | head -n 1)

    # Check if the latest file exists and compare versionId
    if [ -f "$latest_backup" ]; then
      latest_version_id=$(jq -r '.versionId' "$latest_backup")

      # If the versionId is the same, skip saving
      if [ "$latest_version_id" == "$version_id" ]; then
        echo "No changes detected for workflow '$name' (ID: $id). Skipping backup."
        continue
      fi
    fi

    # Save the workflow JSON file with a timestamp
    timestamp=$(date +"%Y%m%d%H%M%S")
    workflow_filename="$WORKFLOW_DIR/backup-$id-$timestamp.json"
    echo "$workflow" | jq '.' > "$workflow_filename"
    echo "Workflow '$name' (ID: $id) backed up successfully."

    # Create or update the README.md with Markdown formatting
    cat <<EOF >"$WORKFLOW_DIR/README.md"
# $name

- **Number of nodes:** $nodes_count
- **Last update:** $updated_at
- **Version:** $version_id
- **Tags:** $tags
EOF

  done

  # Check for the next cursor to handle pagination
  cursor=$(echo "$response" | jq -r '.nextCursor')

  # Break the loop if no more pages
  if [ "$cursor" == "null" ]; then
    break
  fi

done

