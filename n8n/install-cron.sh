#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Path to the .env file
ENV_FILE="$SCRIPT_DIR/.env"

# Function to check environment settings
check_env_settings() {
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found in $SCRIPT_DIR."
    exit 1
  fi

  # Source the .env file
  source "$ENV_FILE"

  # Check if required environment variables are set and valid
  if [ -z "$X_N8N_API_KEY" ]; then
    echo "Error: X_N8N_API_KEY is not set in the .env file."
    exit 1
  fi

  if [ "$X_N8N_API_KEY" == "changeme" ]; then
    echo "Error: X_N8N_API_KEY is still set to 'changeme'. Please update it in the .env file."
    exit 1
  fi

  if [ -z "$N8N_BASE_URL" ]; then
    echo "Error: N8N_BASE_URL is not set in the .env file."
    exit 1
  fi
}

# Function to display the menu
display_menu() {
  echo "Choose a cron schedule interval:"
  echo "1) Every 5 minutes"
  echo "2) Every 15 minutes (default)"
  echo "3) Every 1 hour"
  echo "4) Every day"
  echo "5) Custom"
  echo -n "Enter your choice [1-5] (default is 2): "
}

# Function to calculate cron schedule for custom input
calculate_custom_interval() {
  read -p "Enter the interval (e.g., 20m for 20 minutes or 3h for 3 hours): " custom_interval

  if [[ $custom_interval =~ ^([0-9]+)([mh])$ ]]; then
    number="${BASH_REMATCH[1]}"
    unit="${BASH_REMATCH[2]}"

    if [[ $unit == "m" ]]; then
      # Custom interval in minutes
      CRON_SCHEDULE="*/$number * * * *"
    elif [[ $unit == "h" ]]; then
      # Custom interval in hours
      CRON_SCHEDULE="0 */$number * * *"
    else
      echo "Invalid custom interval format. Please use a number followed by 'm' or 'h'."
      exit 1
    fi
  else
    echo "Invalid custom interval format. Please use a number followed by 'm' or 'h'."
    exit 1
  fi
}

# Check environment settings
check_env_settings

# Display menu and read user choice
display_menu
read choice

# Set the cron schedule based on the user's choice
case $choice in
  1) CRON_SCHEDULE="*/5 * * * *" ;;   # Every 5 minutes
  2 | "") CRON_SCHEDULE="*/15 * * * *" ;; # Default: Every 15 minutes
  3) CRON_SCHEDULE="0 * * * *" ;;     # Every 1 hour
  4) CRON_SCHEDULE="0 0 * * *" ;;     # Every day
  5) calculate_custom_interval ;;     # Custom interval
  *) 
     echo "Invalid choice. Defaulting to every 15 minutes."
     CRON_SCHEDULE="*/15 * * * *"
     ;;
esac

# Define the command to run the n8n-backup.sh script
COMMAND="/bin/bash $SCRIPT_DIR/n8n-backup.sh"

# Check if the cron job already exists and remove it if it does
(crontab -l 2>/dev/null | grep -v "$COMMAND") | crontab -

# Add or update the cron job
(crontab -l 2>/dev/null; echo "$CRON_SCHEDULE $COMMAND") | crontab -

echo "Cron job installed to run n8n-backup.sh at the specified interval: $CRON_SCHEDULE."

