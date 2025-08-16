# Use the official Nginx image from the Docker Hub
FROM nginx:alpine

# Copy the static content of the application to the Nginx web root directory
COPY . /usr/share/nginx/html

# Expose port 80 to allow traffic to the web server
EXPOSE 80

# The default command for the nginx image is to start the server,
# so no CMD is needed.
