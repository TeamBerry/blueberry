Deploy

ng build --prod
scp -r dist/ root@berrybox.tv:/var/www/html

# Start Working
Copy the `environments/environment.example.ts` file to `environments/environment.ts` to start working