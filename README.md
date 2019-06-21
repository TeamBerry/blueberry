Deploy

ng build --prod
scp -r dist/ root@berrybox.tv:/var/www/html
