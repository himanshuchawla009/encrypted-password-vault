# torus-email-verification-meta

- Pre requisites:- ``` docker and docker-compose```

Requires a .env file with the following config

```env
#development
NODE_ENV=
AUTH_WEB_URL=https://passwordless.tor.us/verify
PORT=3041
SENDGRID_API_KEY=
```

Also, requires keys for jwt signing to be present in keys folder:

```sh
ssh-keygen -t rsa -b 4096 -m PEM -f keys/jwtRS256.key
openssl rsa -in keys/jwtRS256.key -pubout -outform PEM -out keys/jwtRS256.key.pub
```

Once all are present,

```sh

- Install node deps:- ```npm i```

- Start in dev mode:- ```npm run dev```

```
