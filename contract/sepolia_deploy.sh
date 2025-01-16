# Stop script on error
set -e
 
# Load environment variables from the appropriate file
ENV_FILE=".env.sepolia"
 
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment variables from $ENV_FILE..."
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "Environment file $ENV_FILE not found!"
  exit 1
fi
 
# Define a cleanup function to clear environment variables
cleanup_env() {
  echo "Cleaning up environment variables..."
  unset STARKNET_RPC_URL
  unset DOJO_ACCOUNT_ADDRESS
  unset DOJO_PRIVATE_KEY
  echo "Environment variables cleared."
}
 
# Set the trap to execute cleanup on script exit or error
trap cleanup_env EXIT
 
# Build the project
echo "Building the project..."
sozo -P sepolia build
 
# Deploy the project
echo "Deploying to Sepolia..."
sozo -P sepolia migrate
 
# Deployment succeeded message
echo "Deployment completed successfully."