# n8n Backup Script

This `n8n-backup.sh` script is designed to automatically back up n8n workflows to a local directory, versioning each workflow with a timestamp. It uses the n8n API to fetch the current state of workflows and saves them as JSON files. Additionally, the script maintains a `README.md` file for each workflow directory, providing details such as the number of nodes, last update time, version, and tags.

## How It Works

1. The script uses the n8n REST API to fetch all workflows in batches, handling pagination if there are more workflows than the specified limit (default is 150).
2. For each workflow, it:
   - Checks if a backup exists and compares the `versionId` to see if any changes have occurred.
   - If changes are detected, it saves the workflow to a new JSON file with a timestamp (`YYYYMMDDHHmmss` format) and updates the `README.md` file with relevant details.
3. The backups are stored in a specified directory, organized by workflow ID.

### Pagination

- The script supports pagination by checking for the `nextCursor` value in the API response. If `nextCursor` is present, the script will continue fetching additional pages of workflows until all workflows have been retrieved.
- The default number of workflows fetched per page is set to 150. This value can be configured using the `N8N_PAGINATION_LIMIT` variable in the `.env` file. The maximum permitted size is 250.

## Installation

### 1. Clone or Download the Repository

Clone or download the repository containing the `n8n-backup.sh` script:

```bash
git clone https://github.com/kickin6/studio-utils.git
cd studio-utils/n8n
```

### 2. Set Up Environment Variables

Copy the `env-example` file to `.env`:

```bash
cp env-example .env
```

Edit the `.env` file with your preferred text editor to set the following environment variables:

```bash
# .env file

# Your n8n API key with access to workflows
X_N8N_API_KEY=your-api-key

# The base URL of your n8n instance
N8N_BASE_URL=http://localhost:5678/api/v1/workflows

# Default pagination limit (optional, default is 150)
N8N_PAGINATION_LIMIT=150
```

Replace `your-api-key` and `http://localhost:5678` with your actual API key and the URL of your n8n instance. Adjust the `N8N_PAGINATION_LIMIT` as needed (maximum permitted size is 250).

### 3. Make the Script Executable

Make sure the `n8n-backup.sh` script is executable:

```bash
chmod +x n8n-backup.sh
```

### 4. Test the Script

Run the script manually to test it:

```bash
./n8n-backup.sh
```

This command will perform a backup of all workflows that have changed since the last backup, including handling pagination to fetch all workflows in batches.

## Automate Backups with Cron

You can automate the backup process by setting up a cron job. The cron job will run the script at a specified interval.

### 1. Use the Provided Cronjob Install Script

To simplify the installation of the cron job, use the provided `install-cron.sh` script.

#### `install-cron.sh`

The `install-cron.sh` script allows you to set up a cron job with a specified interval:

- **Every 5 minutes**
- **Every 15 minutes (default)**
- **Every 1 hour**
- **Every day**
- **Custom interval**

Run the following command to execute the script:

```bash
./install-cron.sh
```

Follow the menu prompts to choose the desired interval. If you select "Custom," you can specify an interval in minutes (e.g., `20m` for 20 minutes) or hours (e.g., `3h` for 3 hours).

### 2. Verify the Cron Job

To verify that the cron job is installed, run:

```bash
crontab -l
```

You should see an entry for the `n8n-backup.sh` script.

## Notes

- The default page size for fetching workflows is set to 150. You can modify this by changing the `N8N_PAGINATION_LIMIT` in the `.env` file (maximum permitted size is 250).
- To remove the cron job, you can manually edit the crontab with `crontab -e` or run a command to clear it.
- Ensure that the `.env` file is correctly set up with your API key and the base URL of your n8n instance to allow the script to authenticate and fetch workflows.
