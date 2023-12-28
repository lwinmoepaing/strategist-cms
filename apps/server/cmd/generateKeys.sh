
random_color() {
  echo "$((RANDOM % 256));$((RANDOM % 256));$((RANDOM % 256))"
}

gradient_text() {
  local text="$1"
  for ((i = 0; i < ${#text}; i++)); do
    text_color="38;2;$(random_color)"

    char="${text:$i:1}"

    echo -e -n "\033[${text_color}m$char\033[0m"
  done
  echo
}

# Check if ".env" file exists
if [ ! -e .env ]; then
  gradient_text "======================================="
  echo " Not found (.env) file"
  gradient_text "======================================="
  echo "Message: The '.env' file does not exist."
  echo "Guide: Please create .env file [ can copy from (.env.example)]"
  gradient_text "................................"
  exit 1
fi

gradient_text "======================================="
echo " Start Generating For Access Token Keys"
gradient_text "======================================="
# Generate private key and save it to private.pem
openssl genpkey -algorithm RSA -out private.pem -aes256

# Extract the public key from the private key and save it to public.pem
openssl rsa -pubout -in private.pem -out public.pem


echo " ... "
gradient_text "======================================="
echo " Next Generating For Refresh Token Keys"
gradient_text "======================================="

# Generate private key and save it to private.pem
openssl genpkey -algorithm RSA -out private-refresh.pem -aes256

# Extract the public key from the private key and save it to public.pem
openssl rsa -pubout -in private-refresh.pem -out public-refresh.pem


echo " ... "
gradient_text "======================================="
echo " Starting Update our Environment(.env) "
gradient_text "======================================="

# Read existing .env file
envFile=".env"
envContent=$(cat $envFile)

# Update only the token keys in .env file
accessTokenPublic=$(awk '/-----BEGIN PUBLIC KEY-----/{flag=1; next} /-----END PUBLIC KEY-----/{flag=0} flag' public.pem | tr -d '\n')
accessTokenPrivate=$(awk '/-----BEGIN ENCRYPTED PRIVATE KEY-----/{flag=1; next} /-----END ENCRYPTED PRIVATE KEY-----/{flag=0} flag' private.pem | tr -d '\n')
refreshTokenPublic=$(awk '/-----BEGIN PUBLIC KEY-----/{flag=1; next} /-----END PUBLIC KEY-----/{flag=0} flag' public-refresh.pem | tr -d '\n')
refreshTokenPrivate=$(awk '/-----BEGIN ENCRYPTED PRIVATE KEY-----/{flag=1; next} /-----END ENCRYPTED PRIVATE KEY-----/{flag=0} flag' private-refresh.pem | tr -d '\n')

updatedEnvContent=$(echo "$envContent" | \
  sed "s|ACCESS_TOKEN_PUBLIC=.*|ACCESS_TOKEN_PUBLIC=\"$accessTokenPublic\"|" | \
  sed "s|ACCESS_TOKEN_PRIVATE=.*|ACCESS_TOKEN_PRIVATE=\"$accessTokenPrivate\"|" | \
  sed "s|REFRESH_TOKEN_PUBLIC=.*|REFRESH_TOKEN_PUBLIC=\"$refreshTokenPublic\"|" | \
  sed "s|REFRESH_TOKEN_PRIVATE=.*|REFRESH_TOKEN_PRIVATE=\"$refreshTokenPrivate\"|")

# Write the changes back to .env file
echo "$updatedEnvContent" > $envFile

echo " ... "
gradient_text "======================================="
echo " Token keys updated successfully... "
gradient_text "======================================="

# Clean up temporary key files
rm private.pem public.pem private-refresh.pem public-refresh.pem
echo " ... "
gradient_text "======================================="
echo " Finished: Removing... Key files "
gradient_text "======================================="
